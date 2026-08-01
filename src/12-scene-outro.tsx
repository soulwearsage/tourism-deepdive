import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { SceneFrame } from "./SceneFrame";
import { specialGothicExpandedFont } from "./fonts";

export type OutroSceneProps = {
  spotName: string;
  accentColor: string;
  narrationSrc?: string;
  episodeNumber: number;
  jaSubtitle?: string;
};

export const OutroScene: React.FC<OutroSceneProps> = ({
  spotName,
  accentColor,
  narrationSrc,
  episodeNumber,
  jaSubtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 14 } });
  const taglineOpacity = interpolate(frame, [65, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <SceneFrame accentColor={accentColor} cornerLabel="DEEP DIVE" cornerSubLabel={`NO. ${String(episodeNumber).padStart(3, "0")}`} footerLeft="Japan Deep Dive" footerRight="END" narrationSrc={narrationSrc} jaSubtitle={jaSubtitle}>
      <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
          <div style={{ color: "#f5f2eb", fontSize: 56, fontWeight: 700, fontFamily: specialGothicExpandedFont }}>
            Worth the visit?
          </div>
          <div style={{ color: accentColor, fontSize: 56, fontWeight: 700, fontFamily: specialGothicExpandedFont }}>
            Absolutely.
          </div>
          <div style={{ width: 60, height: 1, background: "#4a453d", margin: "32px auto" }} />
          <div style={{ color: "#9a9285", fontSize: 28, fontFamily: "'Liberation Serif', serif", fontStyle: "italic" }}>
            {spotName} — Deep Dive series
          </div>
          <div style={{ color: accentColor, fontSize: 26, fontWeight: 700, letterSpacing: 3, marginTop: 38, opacity: taglineOpacity, fontFamily: specialGothicExpandedFont }}>
            Follow for hidden Japan.
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
