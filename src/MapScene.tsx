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
  municipalityId: string; // 5桁の市区町村コード(例: 京都市="26100")。この市区町村までピンポイントでズームする
  regionLabel: string;
  spotLabel: string;
  narrationSrc?: string;
  accentColor: string;
  episodeNumber: number;
};

const WIDTH = 800;
const HEIGHT = 900;

export const MapScene: React.FC<MapProps> = ({
  prefectureId,
  municipalityId,
  regionLabel,
  spotLabel,
  narrationSrc,
  accentColor,
  episodeNumber,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { countryPaths, prefPaths, muniPaths, targetMuniPath, centroid } = useMemo(() => {
    const country = topojson.feature(japan as any, (japan as any).objects.country) as any;
    const prefs = topojson.feature(japan as any, (japan as any).objects.prefectures) as any;
    const munis = topojson.feature(japan as any, (japan as any).objects.municipalities) as any;
    const projection = d3geo.geoIdentity().fitSize([WIDTH, HEIGHT], country);
    const path = d3geo.geoPath(projection);

    // 同じ都道府県内の市区町村だけに絞る(全国2800件を毎回描くと重いため)
    const prefPrefix = municipalityId.slice(0, 2);
    const sameAreaMunis = munis.features.filter((f: any) => String(f.id).startsWith(prefPrefix));
    const targetMuni = munis.features.find((f: any) => String(f.id) === municipalityId);
    const c = targetMuni ? path.centroid(targetMuni) : [WIDTH / 2, HEIGHT / 2];

    return {
      countryPaths: country.features
        ? country.features.map((f: any) => ({ d: path(f) as string }))
        : [{ d: path(country) as string }],
      prefPaths: prefs.features.map((f: any) => ({ d: path(f) as string })),
      muniPaths: sameAreaMunis.map((f: any) => ({ d: path(f) as string })),
      targetMuniPath: targetMuni ? (path(targetMuni) as string) : null,
      centroid: c as [number, number],
    };
  }, [prefectureId, municipalityId]);

  // 全体像(国の輪郭)がまず浮かび上がる
  const countryOpacity = interpolate(frame, [0, 30], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // ズームが進むにつれ、都道府県の輪郭→市区町村の輪郭へ切り替わる
  const prefOpacity = interpolate(frame, [40, 65], [0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const muniOpacity = interpolate(frame, [55, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fillOpacity = interpolate(frame, [60, 82], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pinDrop = spring({ frame: frame - 78, fps, config: { damping: 10 } });
  const pinOpacity = interpolate(frame, [78, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = interpolate(frame % 40, [0, 20, 40], [0, 1, 0]);
  const labelOpacity = interpolate(frame, [92, 108], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 「日本全体」から「市区町村」まで、一気にピンポイントへズームする
  const zoom = interpolate(frame, [35, 95], [1, 34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <SceneFrame accentColor={accentColor} cornerLabel="DEEP DIVE" cornerSubLabel={`NO. ${String(episodeNumber).padStart(3, "0")}`} footerLeft="Japan Deep Dive" footerRight="MAP" narrationSrc={narrationSrc}>
      {(() => {
        // ズームはCSSのtransform: scaleではなく、SVG自体の実サイズを毎フレーム
        // 変えることで実現する。線が常にベクターとしてシャープに再描画される。
        const baseLeft = (1080 - WIDTH) / 2;
        const baseTop = (1920 - HEIGHT) / 2;
        const svgWidth = WIDTH * zoom;
        const svgHeight = HEIGHT * zoom;
        const left = baseLeft + centroid[0] * (1 - zoom);
        const top = baseTop + centroid[1] * (1 - zoom);

        return (
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={"0 0 " + WIDTH + " " + HEIGHT}
            style={{ position: "absolute", left, top }}
          >
            {/* 日本全体の輪郭(うっすら、常に背景として) */}
            <g style={{ opacity: countryOpacity }}>
              {countryPaths.map((p, i) => (
                <path key={i} d={p.d} fill="none" stroke="#8a8478" strokeWidth={0.6 / Math.max(zoom / 6, 1)} />
              ))}
            </g>
            {/* 都道府県境界(序盤だけ見せて、市区町村境界にフェードで切り替える) */}
            <g style={{ opacity: prefOpacity }}>
              {prefPaths.map((p, i) => (
                <path key={i} d={p.d} fill="none" stroke="#8a8478" strokeWidth={0.7 / Math.max(zoom / 6, 1)} />
              ))}
            </g>
            {/* 同じ都道府県内の市区町村境界(ピンポイントの精度はここで出す) */}
            <g style={{ opacity: muniOpacity }}>
              {muniPaths.map((p, i) => (
                <path key={i} d={p.d} fill="none" stroke="#a39a86" strokeWidth={0.35 / Math.max(zoom / 6, 1)} />
              ))}
            </g>
            {targetMuniPath && <path d={targetMuniPath} fill={accentColor} fillOpacity={fillOpacity} stroke="none" />}
            <g style={{ opacity: pinOpacity, transform: `translateY(${interpolate(pinDrop, [0, 1], [-60, 0])}px)` }}>
              <circle cx={centroid[0]} cy={centroid[1]} r={(13 + pulse * 30) / Math.max(zoom, 1)} fill={accentColor} opacity={0.35 * (1 - pulse)} />
              <circle cx={centroid[0]} cy={centroid[1]} r={13 / Math.max(zoom, 1)} fill={accentColor} />
              <circle cx={centroid[0]} cy={centroid[1]} r={13 / Math.max(zoom, 1)} fill="none" stroke="#060606" strokeWidth={2.2 / Math.max(zoom, 1)} />
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
