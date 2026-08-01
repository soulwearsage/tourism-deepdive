import React from "react";
import { Audio, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { SceneFrame } from "./SceneFrame";
import { specialGothicExpandedFont } from "./fonts";

const _LOWERCASE_WORDS = new Set(['is','at','a','an','the','of','in','on','to','and','or','for','with','from','as','by']);
function toTitleCase(str: string): string {
  return str.toLowerCase().split(' ').map((word, i) => {
    if (i === 0) return word.charAt(0).toUpperCase() + word.slice(1);
    const bare = word.replace(/[^a-z]/g, '');
    return _LOWERCASE_WORDS.has(bare) ? word : word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

export type CatchCopySceneProps = {
  accentColor: string;
  episodeNumber: number;
  catchCopy?: string;
  catchCopyFont?: string;
  catchCopyFontSize?: number;
  introSfx?: string;
  jaSubtitle?: string;
};

export const CatchCopyScene: React.FC<CatchCopySceneProps> = ({
  accentColor,
  episodeNumber,
  catchCopy,
  catchCopyFont,
  catchCopyFontSize,
  introSfx,
  jaSubtitle,
}) => {
  const frame = useCurrentFrame();
  const bassHitSeconds = introSfx?.includes("light") ? 1.7 : 1.2;
  const bassFrame = Math.round(bassHitSeconds * 30);

  const baseOpacity = interpolate(frame, [0, 8, 100, 130], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bassFlash = interpolate(
    frame,
    [bassFrame, bassFrame + 18, bassFrame + 26, bassFrame + 48],
    [1, 0.25, 0.25, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = baseOpacity * bassFlash;
  const scale = interpolate(frame, [0, 12], [1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const glitchOffset = interpolate(frame, [0, 3, 6, 9, 14], [18, 10, 14, 4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textStyle: React.CSSProperties = {
    fontSize: catchCopyFontSize ?? 60,
    fontWeight: 400,
    lineHeight: 1.15,
    fontFamily: catchCopyFont ?? specialGothicExpandedFont,
  };
  return (
    <SceneFrame
      accentColor={accentColor}
      cornerLabel="DEEP DIVE"
      cornerSubLabel={`NO. ${String(episodeNumber).padStart(3, "0")}`}
      footerLeft="Japan Deep Dive"
      footerRight="INTRO"
      jaSubtitle={jaSubtitle}
      jaSubtitleEndFrame={100}
    >
      {introSfx && <Audio src={staticFile(introSfx)} volume={0.18} />}
      <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", padding: "0 100px" }}>
        <div style={{ textAlign: "center", opacity, transform: `scale(${scale})`, position: "relative" }}>
          <div
            style={{
              ...textStyle,
              position: "absolute",
              inset: 0,
              color: "#ff3b5c",
              mixBlendMode: "screen",
              transform: `translateX(${-glitchOffset}px)`,
            }}
          >
            {toTitleCase(catchCopy ?? "")}
          </div>
          <div
            style={{
              ...textStyle,
              position: "absolute",
              inset: 0,
              color: "#3bdcff",
              mixBlendMode: "screen",
              transform: `translateX(${glitchOffset}px)`,
            }}
          >
            {toTitleCase(catchCopy ?? "")}
          </div>
          <div style={{ ...textStyle, position: "relative", color: "#f5f2eb" }}>{toTitleCase(catchCopy ?? "")}</div>
        </div>
      </div>
    </SceneFrame>
  );
};
