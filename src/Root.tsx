import React from "react";
import { Composition } from "remotion";
import { DeepDive, getTotalDuration } from "./DeepDive";
import * as fushimiInari from "./spots/001-fushimi-inari";
import * as itsukushima from "./spots/002-itsukushima";
import * as takaya from "./spots/003-takaya";
import * as ise from "./spots/004-ise";
import * as kumano from "./spots/005-kumano";
import * as izumo from "./spots/006-izumo";
import * as gassan from "./spots/007-gassan";
import * as minashi from "./spots/008-minashi";
import * as hasedera from "./spots/009-hasedera";
import * as hosenin from "./spots/010-hosenin";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="DeepDive-FushimiInari"
        component={DeepDive}
        durationInFrames={getTotalDuration(fushimiInari.facts, fushimiInari.sceneDurations, fushimiInari.defaultProps)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={fushimiInari.defaultProps}
      />
      <Composition
        id="DeepDive-Itsukushima"
        component={DeepDive}
        durationInFrames={getTotalDuration(itsukushima.facts, itsukushima.sceneDurations, itsukushima.defaultProps)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={itsukushima.defaultProps}
      />
      <Composition
        id="DeepDive-Takaya"
        component={DeepDive}
        durationInFrames={getTotalDuration(takaya.facts, takaya.sceneDurations, takaya.defaultProps)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={takaya.defaultProps}
      />
      <Composition
        id="DeepDive-Ise"
        component={DeepDive}
        durationInFrames={getTotalDuration(ise.facts, ise.sceneDurations, ise.defaultProps)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={ise.defaultProps}
      />
      <Composition
        id="DeepDive-Kumano"
        component={DeepDive}
        durationInFrames={getTotalDuration(kumano.facts, kumano.sceneDurations, kumano.defaultProps)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={kumano.defaultProps}
      />
      <Composition
        id="DeepDive-Izumo"
        component={DeepDive}
        durationInFrames={getTotalDuration(izumo.facts, izumo.sceneDurations, izumo.defaultProps)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={izumo.defaultProps}
      />
      <Composition
        id="DeepDive-Gassan"
        component={DeepDive}
        durationInFrames={getTotalDuration(gassan.facts, gassan.sceneDurations, gassan.defaultProps)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={gassan.defaultProps}
      />
      <Composition
        id="DeepDive-Minashi"
        component={DeepDive}
        durationInFrames={getTotalDuration(minashi.facts, minashi.sceneDurations, minashi.defaultProps)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={minashi.defaultProps}
      />
      <Composition
        id="DeepDive-Hasedera"
        component={DeepDive}
        durationInFrames={getTotalDuration(hasedera.facts, hasedera.sceneDurations, hasedera.defaultProps)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={hasedera.defaultProps}
      />      <Composition
        id="DeepDive-Hosenin"
        component={DeepDive}
        durationInFrames={getTotalDuration(hosenin.facts, hosenin.sceneDurations, hosenin.defaultProps)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={hosenin.defaultProps}
      />
    </>
  );
};