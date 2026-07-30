import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { zenKurernaidoFont } from "./fonts";

const MAX_LINE_CHARS = 23;
const MIN_SPLIT_CHARS = 80; // これより短いテキストは分割しない

export function splitSubtitleLines(text: string): string[] {
  const lines: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= MAX_LINE_CHARS) {
      lines.push(remaining);
      break;
    }

    const chunk = remaining.slice(0, MAX_LINE_CHARS);

    // Priority 1: 23文字以内の最後の句点で改行
    const kIdx = chunk.lastIndexOf("。");
    if (kIdx !== -1) {
      lines.push(remaining.slice(0, kIdx + 1));
      remaining = remaining.slice(kIdx + 1);
      continue;
    }

    // Priority 2: 23文字以内の最後の読点で改行
    const tIdx = chunk.lastIndexOf("、");
    if (tIdx !== -1) {
      lines.push(remaining.slice(0, tIdx + 1));
      remaining = remaining.slice(tIdx + 1);
      continue;
    }

    // Priority 3: Intl.Segmenter で単語境界を検出し、残り文字数の中点に最も近い区切りで改行
    // (「最後の境界」ではなく「中点に近い境界」を選ぶことで、短すぎる行の生成を防ぐ)
    const segmenter = new Intl.Segmenter("ja", { granularity: "word" });
    const mid = remaining.length / 2;
    let breakAt = 0;
    let bestDist = Infinity;
    for (const seg of segmenter.segment(remaining)) {
      const end = seg.index + seg.segment.length;
      if (end > MAX_LINE_CHARS) break;
      const dist = Math.abs(end - mid);
      if (dist < bestDist) {
        bestDist = dist;
        breakAt = end;
      }
    }

    if (breakAt > 0) {
      lines.push(remaining.slice(0, breakAt));
      remaining = remaining.slice(breakAt);
    } else {
      lines.push(chunk);
      remaining = remaining.slice(MAX_LINE_CHARS);
    }
  }

  return lines.filter((l) => l.length > 0);
}

// 長いテキストを句点で最も均等に前半・後半に2分割する。短すぎる/分割不要ならnullを返す
function splitAtMidKuten(text: string): [string, string] | null {
  if (text.length < MIN_SPLIT_CHARS) return null;
  const positions: number[] = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "。") positions.push(i + 1);
  }
  if (positions.length < 2) return null;
  const mid = text.length / 2;
  let bestPos = positions[0];
  let bestDist = Math.abs(positions[0] - mid);
  for (const pos of positions) {
    const dist = Math.abs(pos - mid);
    if (dist < bestDist) { bestDist = dist; bestPos = pos; }
  }
  const second = text.slice(bestPos).trim();
  if (!second) return null;
  return [text.slice(0, bestPos), second];
}

export const JaSubtitleBar: React.FC<{ text: string; startFrame?: number; totalFrames?: number; endFrame?: number }> = ({ text, startFrame = 0, totalFrames, endFrame }) => {
  const frame = useCurrentFrame();

  const fadeOut = endFrame !== undefined
    ? interpolate(frame, [endFrame, endFrame + 20], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 145,
    left: 0,
    right: 0,
    padding: "0 90px",
    textAlign: "center",
    fontFamily: zenKurernaidoFont,
    fontSize: 38,
    fontWeight: 400,
    color: "#c8c4bc",
    textShadow: "0 2px 10px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,1)",
    lineHeight: 1.6,
    zIndex: 20,
    pointerEvents: "none",
  };

  const splitPair = totalFrames ? splitAtMidKuten(text) : null;

  if (splitPair) {
    const [firstHalf, secondHalf] = splitPair;
    // テキスト長の比率でスイッチタイミングを決める(文字数≒読み上げ時間の近似)
    const switchFrame = Math.round(totalFrames! * (firstHalf.length / text.length));
    const fadeLen = 20;
    const firstOpacity = interpolate(
      frame,
      [startFrame, startFrame + fadeLen, switchFrame, switchFrame + fadeLen],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    ) * fadeOut;
    const secondOpacity = interpolate(
      frame,
      [switchFrame, switchFrame + fadeLen],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    ) * fadeOut;
    const firstLines = splitSubtitleLines(firstHalf);
    const secondLines = splitSubtitleLines(secondHalf);
    return (
      <>
        <div style={{ ...baseStyle, opacity: firstOpacity }}>
          {firstLines.map((line, i) => <div key={i} style={{ whiteSpace: "nowrap" }}>{line}</div>)}
        </div>
        <div style={{ ...baseStyle, opacity: secondOpacity }}>
          {secondLines.map((line, i) => <div key={i} style={{ whiteSpace: "nowrap" }}>{line}</div>)}
        </div>
      </>
    );
  }

  const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * fadeOut;
  const lines = splitSubtitleLines(text);
  return (
    <div style={{ ...baseStyle, opacity }}>
      {lines.map((line, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>{line}</div>
      ))}
    </div>
  );
};
