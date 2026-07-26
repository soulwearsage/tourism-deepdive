import React from "react";
import { Img, staticFile } from "remotion";

type GradedPhotoProps = {
  src: string;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  intensity?: number; // 0〜1。0=無加工、1=フルのグレーディング。デフォルト1
};

// フルにかけたときの目標値(intensity=1のとき)
const GRADE = {
  saturate: 0.72,
  contrast: 0.92,
  brightness: 0.9,
  hueRotate: -9,
  sepia: 0.06,
  tintAlpha: 0.16,
};

// 無加工(intensity=0)の基準値
const NEUTRAL = {
  saturate: 1,
  contrast: 1,
  brightness: 1,
  hueRotate: 0,
  sepia: 0,
  tintAlpha: 0,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const GradedPhoto: React.FC<GradedPhotoProps> = ({
  src,
  style,
  imgStyle,
  intensity = 1,
}) => {
  const t = Math.max(0, Math.min(1, intensity));

  const saturate = lerp(NEUTRAL.saturate, GRADE.saturate, t);
  const contrast = lerp(NEUTRAL.contrast, GRADE.contrast, t);
  const brightness = lerp(NEUTRAL.brightness, GRADE.brightness, t);
  const hueRotate = lerp(NEUTRAL.hueRotate, GRADE.hueRotate, t);
  const sepia = lerp(NEUTRAL.sepia, GRADE.sepia, t);
  const tintAlpha = lerp(NEUTRAL.tintAlpha, GRADE.tintAlpha, t);

  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `saturate(${saturate}) contrast(${contrast}) brightness(${brightness}) hue-rotate(${hueRotate}deg) sepia(${sepia})`,
          ...imgStyle,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(18, 42, 46, ${tintAlpha})`,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};
