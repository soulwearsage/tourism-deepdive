import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { StaggeredText } from "./StaggeredText";

export type TextHeroProps = {
  eyebrow: string;        // 例: "Deep Dive — 01" や "Fact 02"
  heading: string;        // 太いゴシックの主見出し(複数行は\nで改行)
  subheading?: string;    // 日本語の小見出し(例: "伏見稲荷大社 / KYOTO")
  tagline?: string;       // 罫線の下に置く一言(例: "THE VERMILION PATH")
  accentColor: string;
};

/**
 * 写真が無い場面用の「文字だけで見せる」シーン。
 * SceneFrameの中でchildrenとして使う想定(漢字の透かし・コーナーラベル・
 * フッターはSceneFrame側が担当するので、ここでは中央のタイポグラフィだけを描く)
 */
export const TextHeroScene: React.FC<TextHeroProps> = ({ eyebrow, heading, subheading, tagline, accentColor }) => {
  const frame = useCurrentFrame();

  const headingOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headingY = interpolate(frame, [10, 30], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eyebrowOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [30, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const headingLines = heading.split("\n");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 90px",
      }}
    >
      <div style={{ color: accentColor, fontSize: 22, letterSpacing: 8, marginBottom: 24, fontFamily: "'Liberation Serif', serif", fontStyle: "italic", opacity: eyebrowOpacity }}>
        {eyebrow}
      </div>

      <div style={{ opacity: headingOpacity, transform: `translateY(${headingY}px)` }}>
        <div style={{ color: "#f5f2eb", fontSize: 88, fontWeight: 900, lineHeight: 1.02, fontFamily: "'DejaVu Sans', sans-serif" }}>
          {headingLines.map((line, i) => (
            <React.Fragment key={i}>
              <StaggeredText text={line} frame={frame} startFrame={10 + i * 8} />
              {i < headingLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>

        {subheading && (
          <div style={{ color: "#8a8478", fontSize: 30, marginTop: 22, letterSpacing: 4, fontFamily: "'Noto Serif CJK JP', 'Noto Serif JP', serif" }}>
            {subheading}
          </div>
        )}

        {tagline && (
          <>
            <div style={{ width: 90, height: 1, background: "#4a453d", margin: "36px 0" }} />
            <div style={{ color: accentColor, fontSize: 22, letterSpacing: 4, fontFamily: "'DejaVu Sans', sans-serif", fontWeight: 700, opacity: taglineOpacity }}>
              {tagline}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
