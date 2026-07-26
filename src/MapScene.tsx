import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import * as d3geo from "d3-geo";
import * as topojson from "topojson-client";
// @ts-ignore
import japan from "jpn-atlas/japan/japan.json";
import { SceneFrame } from "./SceneFrame";
import { specialGothicExpandedFont } from "./fonts";

export type MapProps = {
  prefectureId: string;
  regionLabel: string;
  spotLabel: string;
  narrationSrc?: string;
  accentColor: string;
  episodeNumber: number;
};

const WIDTH = 800;
const HEIGHT = 900;

export const MapScene: React.FC<MapProps> = ({ prefectureId, regionLabel, spotLabel, narrationSrc, accentColor, episodeNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { prefPaths, targetPath, centroid } = useMemo(() => {
    const prefs = topojson.feature(japan as any, (japan as any).objects.prefectures) as any;
    const country = topojson.feature(japan as any, (japan as any).objects.country) as any;
    const projection = d3geo.geoIdentity().fitSize([WIDTH, HEIGHT], country);
    const path = d3geo.geoPath(projection);

    const target = prefs.features.find((f: any) => String(f.id) === prefectureId);
    const c = target ? path.centroid(target) : [WIDTH / 2, HEIGHT / 2];

    return {
      prefPaths: prefs.features.map((f: any) => ({ d: path(f) as string })),
      targetPath: target ? (path(target) as string) : null,
      centroid: c as [number, number],
    };
  }, [prefectureId]);

  const outlineOpacity = interpolate(frame, [0, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fillOpacity = interpolate(frame, [30, 55], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pinDrop = spring({ frame: frame - 55, fps, config: { damping: 10 } });
  const pinOpacity = interpolate(frame, [55, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = interpolate(frame % 40, [0, 20, 40], [0, 1, 0]);
  const labelOpacity = interpolate(frame, [70, 88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoom = interpolate(frame, [75, 110], [1, 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <SceneFrame accentColor={accentColor} cornerLabel="DEEP DIVE" cornerSubLabel={`NO. ${String(episodeNumber).padStart(3, "0")}`} footerLeft="Japan Deep Dive" footerRight="MAP" narrationSrc={narrationSrc}>
      {(() => {
        // ズームをCSSの拡大(transform: scale)ではなく、SVG自体の実サイズを
        // 毎フレーム変えることで実現する。CSS拡大だとブラウザが先に軽量な
        // ビットマップとして描画してから引き伸ばすことがあり、ぼやける原因になる。
        // SVGの実サイズ自体を変えれば、常にベクターとしてシャープに再描画される。
        const baseLeft = (1080 - WIDTH) / 2;
        const baseTop = (1920 - HEIGHT) / 2;
        const svgWidth = WIDTH * zoom;
        const svgHeight = HEIGHT * zoom;
        // ズームの中心(都道府県の重心)が画面上で同じ位置に留まるよう、左上位置を補正する
        const left = baseLeft + centroid[0] * (1 - zoom);
        const top = baseTop + centroid[1] * (1 - zoom);

        return (
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={"0 0 " + WIDTH + " " + HEIGHT}
            style={{ position: "absolute", left, top }}
          >
            <g style={{ opacity: outlineOpacity }}>
              {prefPaths.map((p, i) => (
                <path key={i} d={p.d} fill="none" stroke="#8a8478" strokeWidth={0.8} />
              ))}
            </g>
            {targetPath && <path d={targetPath} fill={accentColor} fillOpacity={fillOpacity} stroke="none" />}
            <g style={{ opacity: pinOpacity, transform: `translateY(${interpolate(pinDrop, [0, 1], [-60, 0])}px)` }}>
              <circle cx={centroid[0]} cy={centroid[1]} r={5 + pulse * 12} fill={accentColor} opacity={0.3 * (1 - pulse) + 0.05} />
              <circle cx={centroid[0]} cy={centroid[1]} r={6} fill={accentColor} />
              <circle cx={centroid[0]} cy={centroid[1]} r={6} fill="none" stroke="#060606" strokeWidth={1.2} />
            </g>
          </svg>
        );
      })()}

      <div style={{ position: "absolute", bottom: 260, left: 0, right: 0, textAlign: "center", opacity: labelOpacity }}>
        <div style={{ color: accentColor, fontFamily: "'Liberation Serif', serif", fontStyle: "italic", fontSize: 26, letterSpacing: 6 }}>
          {regionLabel}
        </div>
        <div style={{ color: "#f5f2eb", fontFamily: specialGothicExpandedFont, fontWeight: 900, fontSize: 40, marginTop: 10 }}>
          {spotLabel}
        </div>
      </div>
    </SceneFrame>
  );
};
