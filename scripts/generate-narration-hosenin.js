const path = require("path");
const { generateAll } = require("./_openai-common");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio", "010_hosenin");

const LINES = [
  {
    "file": "title.mp3",
    "text": "宝泉院, TODO地名."
  },
  {
    "file": "map.mp3",
    "text": "宝泉院."
  },
  {
    "file": "hook.mp3",
    "text": "柱と柱の間だけを額縁に見立てて庭を鑑賞する完成された美学。でもその青々とした苔の庭は自然に生えたものじゃない。"
  },
  {
    "file": "fact-1.mp3",
    "text": "額縁庭園(盤桓園) 客殿の柱と鴨居を額縁に見立てて、大原の景色を1枚の絵画のように眺める趣向。正面には樹齢700年、近江富士(琵琶湖畔の三上山)をかたどった五葉松。「盤桓」は\"立ち去りがたい\"という意味。"
  },
  {
    "file": "fact-2.mp3",
    "text": "宝泉院には性格の異なる3つの庭園がある(盤桓園・鶴亀庭園・宝楽園)"
  },
  {
    "file": "fact-3.mp3",
    "text": "水琴窟 竹筒に耳を近づけると、地中に埋めた甕に水滴が反響して澄んだ音が聞こえる、音の仕掛け"
  },
  {
    "file": "twist.mp3",
    "text": "この\"完成された美学\"に見える苔庭は、実は自然に生えたものではなく、何世代もの僧侶が何十年もかけて雑草を一本ずつ手作業で抜き続けて維持している、\"人工の極限美\"だった。"
  },
  {
    "file": "outro.mp3",
    "text": "Worth the visit? Absolutely."
  }
];

generateAll(OUTPUT_DIR, LINES);
