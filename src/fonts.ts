import { loadFont as loadParkinsans } from "@remotion/google-fonts/Parkinsans";
import { loadFont as loadSpecialGothicExpandedOne } from "@remotion/google-fonts/SpecialGothicExpandedOne";
import { getAvailableFonts } from "@remotion/google-fonts";

// 鳥居関連のシーン(タイトル・Fact1)で使う、太めのゴシック
export const { fontFamily: parkinsansFont } = loadParkinsans("normal", {
  weights: ["700"],
});

// 狐のシーン(Fact4)で使う、横に広がった individualityのあるゴシック
export const { fontFamily: specialGothicExpandedFont } = loadSpecialGothicExpandedOne();

// キャッチコピーシーン専用(デフォルト)
const _gasoekEntry = getAvailableFonts().find((f) => f.importName === "GasoekOne")!;
_gasoekEntry.load().then(({ loadFont }) => loadFont());
export const gasoekOneFont = "Gasoek One";

// スポット個別上書き用
const _rubikGlitchEntry = getAvailableFonts().find((f) => f.importName === "RubikGlitch")!;
_rubikGlitchEntry.load().then(({ loadFont }) => loadFont());
export const rubikGlitchFont = "Rubik Glitch";
