import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import * as d3geo from "d3-geo";
import * as topojson from "topojson-client";
// @ts-ignore
import worldAtlas from "world-atlas/countries-110m.json";
import { SceneFrame } from "./SceneFrame";
import { specialGothicExpandedFont } from "./fonts";

const WORLD_W = 1080;
const WORLD_H = 540;
const WORLD_ROTATE: [number, number, number] = [-137, 0, 0]; // 日本経度を中心に
const JAPAN_ISO = "392"; // ISO 3166-1 numeric
const BASE_TOP = (1920 - WORLD_H) / 2; // 690 — 縦中央に配置

export type MapWorldToJapanProps = {
  regionLabel: string;
  spotLabel: string;
  narrationSrc?: string;
  accentColor: string;
  episodeNumber: number;
};

export const MapWorldToJapanScene: React.FC<MapWorldToJapanProps> = ({
  regionLabel,
  spotLabel,
  narrationSrc,
  accentColor,
  episodeNumber,
}) => {
  const frame = useCurrentFrame();

  const { countryPaths, japanPaths, japanCentroid, graticule } = useMemo(() => {
    const countries = topojson.feature(
      worldAtlas as any,
      (worldAtlas as any).objects.countries
    ) as any;
    const projection = d3geo
      .geoNaturalEarth1()
      .rotate(WORLD_ROTATE)
      .fitSize([WORLD_W, WORLD_H], countries);
    const path = d3geo.geoPath(projection);

    const countryPaths: string[] = [];
    const japanPaths: string[] = [];
    for (const f of countries.features) {
      const d = path(f) ?? "";
      if (String(f.id) === JAPAN_ISO) {
        japanPaths.push(d);
      } else {
        countryPaths.push(d);
      }
    }

    const japanFeature = countries.features.find(
      (f: any) => String(f.id) === JAPAN_ISO
    );
    const japanCentroid: [number, number] = japanFeature
      ? (path.centroid(japanFeature) as [number, number])
      : [WORLD_W / 2, WORLD_H / 4];

    const graticule = path(d3geo.geoGraticule10()) ?? "";

    return { countryPaths, japanPaths, japanCentroid, graticule };
  }, []);

  // アニメーション
  const worldOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const japanGlow = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // ズームが進むにつれグラチキュール線をフェードアウト
  const graticuleOpacity = interpolate(frame, [0, 20, 100, 140], [0, 0.22, 0.22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = interpolate(frame, [40, 150], [1, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const labelOpacity = interpolate(frame, [148, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // SVGリサイズズーム: Japanのセントロイドを画面上の固定点として保つ
  const svgLeft = japanCentroid[0] * (1 - zoom);
  const svgTop = BASE_TOP + japanCentroid[1] * (1 - zoom);
  // strokeWidthは画面上で常に一定の太さになるよう zoom で割る
  const sw = (base: number) => base / zoom;

  return (
    <SceneFrame
      accentColor={accentColor}
      cornerLabel="DEEP DIVE"
      cornerSubLabel={`NO. ${String(episodeNumber).padStart(3, "0")}`}
      footerLeft="Japan Deep Dive"
      footerRight="MAP"
      narrationSrc={narrationSrc}
    >
      <svg
        width={WORLD_W * zoom}
        height={WORLD_H * zoom}
        viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
        style={{
          position: "absolute",
          left: svgLeft,
          top: svgTop,
          opacity: worldOpacity,
        }}
      >
        {/* 緯度経度線 */}
        <path
          d={graticule}
          fill="none"
          stroke="#2e2b27"
          strokeWidth={sw(0.5)}
          opacity={graticuleOpacity}
        />

        {/* 全国境(日本以外) */}
        {countryPaths.map((d, i) => (
          <path key={i} d={d} fill="#2e2b27" stroke="#141210" strokeWidth={sw(0.4)} />
        ))}

        {/* 日本: ベース(暗色) */}
        {japanPaths.map((d, i) => (
          <path key={`jb-${i}`} d={d} fill="#2e2b27" stroke="#141210" strokeWidth={sw(0.4)} />
        ))}

        {/* 日本: アクセントカラーのグロー層 */}
        {japanPaths.map((d, i) => (
          <path key={`jg-${i}`} d={d} fill={accentColor} fillOpacity={japanGlow} stroke="none" />
        ))}
      </svg>

      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: labelOpacity,
        }}
      >
        <div
          style={{
            color: accentColor,
            fontFamily: "'Liberation Serif', serif",
            fontStyle: "italic",
            fontSize: 26,
            letterSpacing: 6,
          }}
        >
          {regionLabel}
        </div>
        <div
          style={{
            color: "#f5f2eb",
            fontFamily: specialGothicExpandedFont,
            fontWeight: 900,
            fontSize: 40,
            marginTop: 10,
          }}
        >
          {spotLabel}
        </div>
      </div>
    </SceneFrame>
  );
};
