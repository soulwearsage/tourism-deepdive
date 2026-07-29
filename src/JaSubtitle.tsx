import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { zenKurernaidoFont } from "./fonts";

const MAX_LINE_CHARS = 23;

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

    // Priority 3: Intl.Segmenter で単語境界を検出し、23文字以内の最後の区切りで改行
    const segmenter = new Intl.Segmenter("ja", { granularity: "word" });
    let breakAt = 0;
    for (const seg of segmenter.segment(remaining)) {
      const end = seg.index + seg.segment.length;
      if (end <= MAX_LINE_CHARS) {
        breakAt = end;
      } else {
        break;
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

export const JaSubtitleBar: React.FC<{ text: string; startFrame?: number }> = ({ text, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lines = splitSubtitleLines(text);

  return (
    <div
      style={{
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
        opacity,
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>{line}</div>
      ))}
    </div>
  );
};
