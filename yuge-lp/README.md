# 湯気 YUGE Sauna & Spa 神田 — 10周年記念キャンペーン LP

## フォルダ構成

```
yuge-lp/
├── index.html          ← HTML構造（style/scriptタグなし）
├── style.css           ← 全スタイル定義
├── main.js             ← JavaScript（カウントダウン・FAQ・フェードイン・GTM）
├── README.md           ← このファイル
└── images/             ← 画像格納ディレクトリ（下記の画像を配置してください）
    ├── hero-sauna.jpg        ← メインサウナ室（HEROセクション背景）
    ├── sauna-main.jpg        ← フォトカード1
    ├── sauna-womens.jpg      ← フォトカード2
    ├── sauna-entrance.jpg    ← フォトカード3
    ├── sauna-relax.jpg       ← フォトカード4
    ├── sauna-reception.jpg   ← フォトカード5
    └── ogp.jpg               ← OGP画像（1200×630px）
```

## VSCode での開き方

1. このフォルダ（`yuge-lp`）をVSCodeで開く
2. 拡張機能「Live Server」をインストール
3. `index.html` を右クリック → 「Open with Live Server」
4. ブラウザでプレビュー確認（SP表示は DevTools でモバイル表示に切替）

## 差し替えが必要な箇所

| 項目 | ファイル | 検索キーワード |
|------|----------|----------------|
| GTMコンテナID | index.html | `GTM-XXXXXXX` |
| Google Maps embed URL | index.html | `google.com/maps/embed` |
| LINE ID | index.html | `LINE_ID_HERE` |
| 予約URL | index.html | `yuge-reserve.jp` |
| 画像ファイル | images/ | 上記7ファイルを配置 |

## 技術仕様

- **SP優先設計**: `max-width: 430px` を `body` に設定
- **PC表示**: `html` 背景を `#2A2A2A` で左右を埋める
- **フォント**: Google Fonts（Noto Serif JP / Noto Sans JP / Cormorant Garamond）
- **アクセシビリティ**: WCAG AA準拠、タッチターゲット48px以上、aria属性対応
