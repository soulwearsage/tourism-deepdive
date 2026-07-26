import { loadFont as loadParkinsans } from "@remotion/google-fonts/Parkinsans";
import { loadFont as loadSpecialGothicExpandedOne } from "@remotion/google-fonts/SpecialGothicExpandedOne";

// 鳥居関連のシーン(タイトル・Fact1)で使う、太めのゴシック
export const { fontFamily: parkinsansFont } = loadParkinsans("normal", {
  weights: ["700"],
});

// 狐のシーン(Fact4)で使う、横に広がった individualityのあるゴシック
export const { fontFamily: specialGothicExpandedFont } = loadSpecialGothicExpandedOne();
