import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { JaSubtitleBar } from "./JaSubtitle";

export type SceneFrameProps = {
  accentColor: string;
  cornerLabel: string;
  cornerSubLabel?: string;
  footerLeft: string;
  footerRight: string;
  kanji?: string;
  kanjiOpacity?: number;
  narrationSrc?: string; // public/からの相対パス(例: "audio/001_fushimi-inari/title.mp3")。無ければ無音
  narrationDelayFrames?: number; // ナレーションの開始を遅らせるフレーム数(イントロ音と被らせないため)
  jaSubtitle?: string;          // 日本語字幕(任意)。指定時は画面下部にオーバーレイ表示
  jaSubtitleStartFrame?: number; // 字幕フェードイン開始フレーム(省略時=0)
  jaSubtitleTotalFrames?: number; // シーン総フレーム数。指定時は長い字幕を前半・後半に自動分割表示
  jaSubtitleEndFrame?: number;   // 字幕フェードアウト開始フレーム。英語テキストと同タイミングで消えるシーンで使う
  children: React.ReactNode;
};

/**
 * 全シーン共通の「枠」。コーナーラベル・フッター・漢字の透かし・ナレーション音声は
 * どのシーンでも同じ仕組みで扱う。中身(children)だけがシーンごとに変わる。
 */
export const SceneFrame: React.FC<SceneFrameProps> = ({
  accentColor,
  cornerLabel,
  cornerSubLabel,
  footerLeft,
  footerRight,
  kanji,
  kanjiOpacity = 0.10,
  narrationSrc,
  narrationDelayFrames = 0,
  jaSubtitle,
  jaSubtitleStartFrame,
  jaSubtitleTotalFrames,
  jaSubtitleEndFrame,
  children,
}) => {
  const frame = useCurrentFrame();
  const chromeOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#060606" }}>
      {narrationSrc && (
        <Sequence from={narrationDelayFrames}>
          <Audio src={staticFile(narrationSrc)} />
        </Sequence>
      )}

      {kanji && (
        <div
          style={{
            position: "absolute",
            top: "48%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "'Noto Serif CJK JP', 'Noto Serif JP', serif",
            fontWeight: 700,
            fontSize: 1300,
            color: "#ffffff",
            opacity: kanjiOpacity,
            lineHeight: 1,
          }}
        >
          {kanji}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: 90,
          left: 90,
          color: "#b8afa0",
          fontFamily: "'Liberation Serif', serif",
          fontStyle: "italic",
          fontSize: 20,
          letterSpacing: 3,
          lineHeight: 1.6,
          opacity: chromeOpacity,
          zIndex: 5,
        }}
      >
        {cornerLabel}
        {cornerSubLabel && (
          <>
            <br />
            {cornerSubLabel}
          </>
        )}
      </div>

      {children}

      {jaSubtitle && <JaSubtitleBar text={jaSubtitle} startFrame={jaSubtitleStartFrame} totalFrames={jaSubtitleTotalFrames} endFrame={jaSubtitleEndFrame} />}

      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 90,
          right: 90,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #38352f",
          paddingTop: 22,
          opacity: chromeOpacity,
          zIndex: 5,
        }}
      >
        <div style={{ color: "#6b6558", fontFamily: "'Liberation Serif', serif", fontStyle: "italic", fontSize: 18, letterSpacing: 4 }}>
          {footerLeft}
        </div>
        <div style={{ color: "#6b6558", fontFamily: "'Liberation Serif', serif", fontStyle: "italic", fontSize: 18, letterSpacing: 4 }}>
          {footerRight}
        </div>
      </div>
    </AbsoluteFill>
  );
};
