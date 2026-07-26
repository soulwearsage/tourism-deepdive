import React from "react";
import { interpolate, Easing } from "remotion";

type StaggeredTextProps = {
  text: string;
  frame: number;       // 呼び出し元のuseCurrentFrame()
  startFrame?: number;  // 最初の単語が動き出すフレーム
  staggerFrames?: number; // 単語ごとの時間差
  style?: React.CSSProperties; // 各単語のspanに適用するスタイル(フォント等)
};

/**
 * テキストを単語ごとに分割し、時間差でフェード+わずかな上昇をつけながら
 * 出現させる見出し用コンポーネント。単調な「ブロックごとフェード」より
 * 動きに表情が出る。
 */
export const StaggeredText: React.FC<StaggeredTextProps> = ({
  text,
  frame,
  startFrame = 0,
  staggerFrames = 8,
  style,
}) => {
  const words = text.split(" ");

  return (
    <span style={{ display: "inline" }}>
      {words.map((word, i) => {
        const localFrame = frame - startFrame - i * staggerFrames;
        const opacity = interpolate(localFrame, [0, 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(localFrame, [0, 18], [26, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${y}px)`,
              whiteSpace: "pre",
              ...style,
            }}
          >
            {word}{i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
};
