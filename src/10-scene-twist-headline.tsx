import React from "react";
import { FactScene, FactProps } from "./04-scene-fact1-photo";

export type TwistHeadlineSceneProps = Omit<FactProps, "cornerLabel" | "footerRight">;

export const TwistHeadlineScene: React.FC<TwistHeadlineSceneProps> = (props) => {
  if (props.heading.length > 28) {
    console.warn(`[10-scene-twist-headline] heading ${props.heading.length}字 > 28字: "${props.heading}"`);
  }
  if (props.body.length > 150) {
    console.warn(`[10-scene-twist-headline] body ${props.body.length}字 > 150字: "${props.body}"`);
  }
  return (
    <FactScene
      {...props}
      cornerLabel="DEEP DIVE"
      footerRight="TWIST"
    />
  );
};
