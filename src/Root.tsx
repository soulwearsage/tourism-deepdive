import React from "react";
import { Composition } from "remotion";
import { DeepDive, getTotalDuration } from "./DeepDive";
import * as fushimiInari from "./spots/001-fushimi-inari";
import * as itsukushima from "./spots/002-itsukushima";
import * as takaya from "./spots/003-takaya";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="DeepDive-FushimiInari"
        component={DeepDive}
        durationInFrames={getTotalDuration(fushimiInari.facts, fushimiInari.sceneDurations)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={fushimiInari.defaultProps}
      />
      <Composition
        id="DeepDive-Itsukushima"
        component={DeepDive}
        durationInFrames={getTotalDuration(itsukushima.facts, itsukushima.sceneDurations)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={itsukushima.defaultProps}
      />
      <Composition
        id="DeepDive-Takaya"
        component={DeepDive}
        durationInFrames={getTotalDuration(takaya.facts, takaya.sceneDurations)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={takaya.defaultProps}
      />
    </>
  );
};
