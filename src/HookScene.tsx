import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { SceneFrame } from "./SceneFrame";
import { StaggeredText } from "./StaggeredText";
import { specialGothicExpandedFont } from "./fonts";

export type HookSceneProps = {
  hookText: string;
  accentColor: string;
  kanjiMotif: string;
  narrationSrc?: string;
  episodeNumber: number;
  jaSubtitle?: string;
};

export const HookScene: React.FC<HookSceneProps> = ({
  hookText,
  accentColor,
  kanjiMotif,
  narrationSrc,
  episodeNumber,
  jaSubtitle,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <SceneFrame accentColor={accentColor} cornerLabel="DEEP DIVE" cornerSubLabel={`NO. ${String(episodeNumber).padStart(3, "0")}`} footerLeft="Japan Deep Dive" footerRight="HOOK" narrationSrc={narrationSrc} kanji={kanjiMotif} kanjiOpacity={0.10} jaSubtitle={jaSubtitle}>
      <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", padding: "0 100px" }}>
        <div style={{ textAlign: "center", opacity }}>
          <div style={{ color: accentColor, fontSize: 20, letterSpacing: 8, marginBottom: 24, fontFamily: "'Liberation Serif', serif", fontStyle: "italic" }}>
            MOST VISITORS MISS THIS
          </div>
          <div style={{ width: 60, height: 1, background: "#4a453d", margin: "0 auto 28px" }} />
          <div style={{ color: "#f5f2eb", fontSize: 48, fontWeight: 900, lineHeight: 1.5, fontFamily: specialGothicExpandedFont }}>
            {(() => {
              const lines = hookText.split("\n");
              const staggerFrames = 8;
              const lineStartFrames: number[] = [];
              let wordOffset = 0;
              for (const line of lines) {
                lineStartFrames.push(10 + wordOffset * staggerFrames);
                wordOffset += line.split(" ").length;
              }
              return lines.map((line, i) => (
                <div key={i}>
                  <StaggeredText text={line} frame={frame} startFrame={lineStartFrames[i]} staggerFrames={staggerFrames} />
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
