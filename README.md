# tourism-deepdive

インバウンド向け観光スポット「深掘り解説」動画のRemotionテンプレート。
サンプルは伏見稲荷大社（Fushimi Inari Taisha）で構成。

## セットアップ（ローカルPCで実行）

```bash
cd tourism-deepdive
npm install
npm start        # ブラウザでプレビューが開く（remotion studio）
```

## 構成（4シーン、計30秒 @ 30fps）

1. **TitleScene** — スポット名（英語/日本語）+ ロケーション
2. **StatScene** — 象徴的な数字をカウントアップ（例: 鳥居10,000本+）
3. **TimelineScene** — 創建年 + 進行バー + 一言説明
4. **OutroScene** — 締めのコピー

## 他のスポットに差し替える

`src/Root.tsx` の `defaultProps` を書き換えるだけで別スポットに対応:

```tsx
defaultProps={{
  spotName: "Itsukushima Shrine",
  spotNameJa: "厳島神社",
  foundedYear: "593 AD",
  gateCount: 1,       // ← 数字系のpropsはスポットごとに意味を変えてOK
  location: "Miyajima, Hiroshima",
  accentColor: "#c0392b",
}}
```

数字の意味（鳥居の数、参拝者数、標高など）はスポットごとに変わるので、
`StatScene` のラベル文言(`vermilion torii gates`の部分)も合わせて調整してください。

## 書き出し

```bash
npm run build     # out/video.mp4 が生成される
```

初回はChromiumのダウンロードが走るので、ネット環境が必要です。

## 次の一手

- 実写/イラストの背景画像を `public/` に置いて `<Img>` で差し込む
- ナレーション音声(TTS)を別トラックとして追加
- [[anime-journey-japan]]の神社データ（伊勢神宮、伏見稲荷、熊野本宮大社など）をpropsに流し込めば、
  同じテンプレートで量産できる
