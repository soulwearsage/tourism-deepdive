import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { SceneFrame } from "./SceneFrame";
import { specialGothicExpandedFont } from "./fonts";

export type BigNumberProps = {
  factNumber: number;
  totalFacts: number;
  value: string;
  label: string;
  kanji?: string;
  narrationSrc?: string;
  accentColor: string;
};

export const BigNumberScene: React.FC<BigNumberProps> = ({
  factNumber,
  totalFacts,
  value,
  label,
  kanji,
  narrationSrc,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOpacity = interpolate(frame, [42, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 数値部分を取り出す(例: "5" → 5、"¥1,750,000" → 1750000)
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  const numericTarget = match ? parseInt(match[2].replace(/,/g, ""), 10) : null;
  const prefix = match ? match[1] : "";
  const suffix = match ? match[3] : "";

  // --- 演出の切り替え ---
  // 数値が5以下の小さな数字のときは「点が積み上がって数字になる」演出
  // それ以外(大きい金額など)は「数字がカウントアップしつつ、下線が伸びる」演出
  const useDotBuild = numericTarget !== null && numericTarget <= 8;

  if (useDotBuild && numericTarget) {
    const dots = Array.from({ length: numericTarget }, (_, i) => i);
    // 各ドットが時間差でポップインする
    const dotDelay = 6; // フレーム間隔
    const dotStart = 5;
    // 数字が現れるのはドットが全部揃った後
    const numberRevealFrame = dotStart + numericTarget * dotDelay + 8;
    const numberScale = spring({
      frame: frame - numberRevealFrame,
      fps,
      config: { damping: 10, mass: 0.6 },
    });
    const dotsOpacityOut = interpolate(
      frame,
      [numberRevealFrame, numberRevealFrame + 12],
      [1, 0.15],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
      <SceneFrame
        accentColor={accentColor}
        cornerLabel={`FACT ${String(factNumber).padStart(2, "0")}`}
        footerLeft="Japan Deep Dive"
        footerRight={`${String(factNumber).padStart(2, "0")} / ${String(totalFacts).padStart(2, "0")}`}
        kanji={kanji}
        kanjiOpacity={0.16}
        narrationSrc={narrationSrc}
      >
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 90px" }}>
          {/* 積み上がるドット */}
          <div style={{ display: "flex", gap: 22, marginBottom: 56, opacity: dotsOpacityOut }}>
            {dots.map((i) => {
              const dotFrame = frame - (dotStart + i * dotDelay);
              const dotScale = spring({ frame: dotFrame, fps, config: { damping: 9, mass: 0.5 } });
              const dotY = interpolate(dotScale, [0, 1], [-40, 0]);
              return (
                <div
                  key={i}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: accentColor,
                    transform: `translateY(${dotY}px) scale(${dotScale})`,
                    opacity: dotScale,
                  }}
                />
              );
            })}
          </div>

          {/* 組み上がった数字 */}
          <div style={{ transform: `scale(${numberScale})`, textAlign: "center" }}>
            <div
              style={{
                fontFamily: specialGothicExpandedFont,
                fontWeight: 900,
                fontSize: 160,
                color: accentColor,
                lineHeight: 1,
              }}
            >
              {prefix}{numericTarget}{suffix}
            </div>
            <div
              style={{
                fontFamily: "'Liberation Serif', serif",
                fontStyle: "italic",
                fontSize: 26,
                color: "#9a9285",
                marginTop: 20,
                opacity: labelOpacity,
                maxWidth: 700,
              }}
            >
              {label}
            </div>
          </div>
        </div>
      </SceneFrame>
    );
  }

  // --- 大きい数字用: カウントアップ + 下線が伸びる演出 ---
  const scale = spring({ frame, fps, config: { damping: 11, mass: 0.7 } });
  let displayValue = value;
  if (numericTarget !== null) {
    const progress = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 45 });
    const current = Math.floor(interpolate(progress, [0, 1], [0, numericTarget]));
    displayValue = `${prefix}${current.toLocaleString()}${suffix}`;
  }
  const underlineWidth = interpolate(frame, [20, 50], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <SceneFrame
      accentColor={accentColor}
      cornerLabel={`FACT ${String(factNumber).padStart(2, "0")}`}
      footerLeft="Japan Deep Dive"
      footerRight={`${String(factNumber).padStart(2, "0")} / ${String(totalFacts).padStart(2, "0")}`}
      kanji={kanji}
        kanjiOpacity={0.16}
      narrationSrc={narrationSrc}
    >
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 90px" }}>
        <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
          <div
            style={{
              fontFamily: specialGothicExpandedFont,
              fontWeight: 900,
              fontSize: 128,
              color: accentColor,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {displayValue}
          </div>
          <div style={{ width: `${underlineWidth}%`, height: 2, background: accentColor, opacity: 0.4, margin: "20px auto 0" }} />
          <div
            style={{
              fontFamily: "'Liberation Serif', serif",
              fontStyle: "italic",
              fontSize: 26,
              color: "#9a9285",
              marginTop: 24,
              opacity: labelOpacity,
              maxWidth: 700,
            }}
          >
            {label}
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
