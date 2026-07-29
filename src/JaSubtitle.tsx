import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { wdxlLubrifontJPNFont } from "./fonts";

// 1行の最大文字数。句点で分割した後、この長さを超える場合は読点で追加改行する。
// 「、」「。」の直後のみを改行候補とし、単語・助詞の途中では絶対に改行しない。
const MAX_LINE_CHARS = 29;

export function splitSubtitleLines(text: string): string[] {
  const lines: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // 句点で1文を切り出す(句点含む)
    const kIdx = remaining.indexOf("。");
    const sentence = kIdx === -1 ? remaining : remaining.slice(0, kIdx + 1);
    remaining = kIdx === -1 ? "" : remaining.slice(kIdx + 1);

    if (sentence.length <= MAX_LINE_CHARS) {
      lines.push(sentence);
      continue;
    }

    // MAX_LINE_CHARS を超える文は読点でグリーディに折り返す
    let currentLine = "";
    let seg = sentence;
    while (seg.length > 0) {
      const tIdx = seg.indexOf("、");
      const part = tIdx === -1 ? seg : seg.slice(0, tIdx + 1);
      seg = tIdx === -1 ? "" : seg.slice(tIdx + 1);

      if (currentLine === "") {
        // 最初の読点区間はそのまま設定(それ自体が長くても分割不可)
        currentLine = part;
      } else if ((currentLine + part).length <= MAX_LINE_CHARS) {
        currentLine += part;
      } else {
        lines.push(currentLine);
        currentLine = part;
      }
    }
    if (currentLine) lines.push(currentLine);
  }

  return lines.filter((l) => l.length > 0);
}

export const JaSubtitleBar: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
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
        fontFamily: wdxlLubrifontJPNFont,
        fontSize: 30,
        fontWeight: 400,
        color: "#f5f2eb",
        textShadow: "0 2px 10px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,1)",
        lineHeight: 1.6,
        opacity,
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
};
