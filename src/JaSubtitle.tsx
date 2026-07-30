import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { zenKurernaidoFont } from "./fonts";

const MAX_LINE_CHARS = 20;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// 空行ギャップのマーカー(句点の直後に挿入する視覚的区切り)
const GAP = " ";

/**
 * テキストを表示行に分割する。
 * - 改行優先順: 句点「。」→ 読点「、」→ Intl.Segmenter 単語境界
 * - 「——」「…」は改行ポイントとして使わない
 * - 句点の直後にギャップ行(GAP)を挿入して文のかたまりを視覚的に区切る
 * - 1行の上限: 全角20文字
 */
export function splitSubtitleLines(text: string): string[] {
  const lines: string[] = [];
  let remaining = text.trim();

  while (remaining.length > 0) {
    if (remaining.length <= MAX_LINE_CHARS) {
      lines.push(remaining);
      break;
    }

    const chunk = remaining.slice(0, MAX_LINE_CHARS);

    // Priority 1: 句点 → 改行後にギャップ行を挿入
    const kIdx = chunk.lastIndexOf("。");
    if (kIdx !== -1) {
      lines.push(remaining.slice(0, kIdx + 1));
      remaining = remaining.slice(kIdx + 1).trimStart();
      if (remaining.length > 0) lines.push(GAP);
      continue;
    }

    // Priority 2: 読点
    const tIdx = chunk.lastIndexOf("、");
    if (tIdx !== -1) {
      lines.push(remaining.slice(0, tIdx + 1));
      remaining = remaining.slice(tIdx + 1);
      continue;
    }

    // Priority 3: Intl.Segmenter 単語境界（——/…は改行ポイントとして除外）
    // midTarget: 残り文字が少ない場合は中点狙い、長い場合は20文字上限狙い
    const segmenter = new Intl.Segmenter("ja", { granularity: "word" });
    const midTarget = Math.min(remaining.length / 2, MAX_LINE_CHARS);
    let breakAt = 0;
    let bestDist = Infinity;
    for (const seg of segmenter.segment(remaining)) {
      const end = seg.index + seg.segment.length;
      if (end > MAX_LINE_CHARS) break;
      if (seg.segment === "—" || seg.segment === "——" || seg.segment === "…") continue;
      const dist = Math.abs(end - midTarget);
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

  // 末尾のギャップ行を除去
  while (lines.length > 0 && lines[lines.length - 1] === GAP) {
    lines.pop();
  }

  return lines;
}

export const JaSubtitleBar: React.FC<{
  text: string;
  startFrame?: number;
  totalFrames?: number;
  endFrame?: number;
}> = ({ text, startFrame = 0, totalFrames, endFrame }) => {
  const frame = useCurrentFrame();

  const fadeOut = endFrame !== undefined
    ? interpolate(frame, [endFrame, endFrame + 20], [1, 0], clamp)
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

  const renderLines = (ls: string[]) =>
    ls.map((line, i) => (
      <div key={i} style={{ whiteSpace: "nowrap" }}>{line}</div>
    ));

  const allLines = splitSubtitleLines(text);
  const needsTwoPhase = allLines.length > 4 && !!totalFrames;

  if (!needsTwoPhase) {
    const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], clamp) * fadeOut;
    return <div style={{ ...baseStyle, opacity }}>{renderLines(allLines)}</div>;
  }

  // 2段階表示: 句点後のギャップ行(GAP)を優先して行数の中点近くで分割
  const midLine = Math.floor(allLines.length / 2);
  let splitAt = midLine;
  let minDist = Infinity;
  for (let i = 0; i < allLines.length; i++) {
    if (allLines[i] === GAP) {
      const dist = Math.abs(i - midLine);
      if (dist < minDist) {
        minDist = dist;
        splitAt = i + 1; // ギャップの次の行から後半開始
      }
    }
  }

  const firstLines = allLines.slice(0, splitAt);
  const secondLines = allLines.slice(splitAt);
  const firstText = firstLines.filter(l => l !== GAP).join("");
  const switchFrame = Math.round(totalFrames! * (firstText.length / text.length));
  const fadeLen = 20;

  const firstOpacity = interpolate(
    frame,
    [startFrame, startFrame + fadeLen, switchFrame, switchFrame + fadeLen],
    [0, 1, 1, 0],
    clamp
  ) * fadeOut;

  const secondOpacity = interpolate(
    frame,
    [switchFrame, switchFrame + fadeLen],
    [0, 1],
    clamp
  ) * fadeOut;

  return (
    <>
      <div style={{ ...baseStyle, opacity: firstOpacity }}>{renderLines(firstLines)}</div>
      <div style={{ ...baseStyle, opacity: secondOpacity }}>{renderLines(secondLines)}</div>
    </>
  );
};
