# ロッケンロー★サミット 公式サイト

ライブハウスの WALL（フライヤーが貼られた壁）をモチーフにした
ロッケンロー★サミットの公式サイト一式です。

## ファイル構成

```
.
├── index.html   ... ページ本体（全セクション）
├── style.css    ... デザイン（ライブハウスの壁／フライヤー風）
├── script.js    ... ナビ／フェードイン／フライヤー拡大表示／エンドロール制御
└── README.md    ... 本ファイル
```

## デザインコンセプト

- ベース：渋谷のライブハウスのコンクリ壁
- 主役：歴代フライヤー（紙質・ガムテープ・斜め配置）
- カラー：BLACK / RED（「ロックンロールとは赤」「ロックンロールとは黒」）
- タイポ：明朝太字（日本語）+ Bungee / Anton（欧文）
- 演出：ノイズ／グレイン、星のスピン、ホバーで真っ直ぐに戻るフライヤー
- エンドロール：映画のように下から上へ流れる「ロックンロール教」

## セクション

1. ABOUT（ロッケンロー★サミットとは）
2. NEWS（2026 開催決定など）
3. HISTORY（2000–2025 全 25 回ぶんの開催情報・出演者）
4. FLYER（2000–2025 のフライヤー）※画像差し替え待ち
5. MOVIE（ライブ映像）※リンク差し替え待ち
6. GALLERY（ライブ写真）※画像差し替え待ち
7. INTERVIEW（PINHEAD / CD Journal P4）※画像差し替え待ち
8. GOODS / SNS（threechord.base.shop / Instagram / X）
9. ENDROLL（ロックンロール教 → YOU-DIE!!!）

## 後日データを当てはめる手順

### ① フライヤー画像（FLYER セクション）

`index.html` の `.flyer-card` の中身を以下のように差し替えてください。

```html
<a class="flyer-card" data-year="2025" href="img/flyer-2025-large.jpg">
  <div class="flyer-img">
    <img src="img/flyer-2025.jpg" alt="ロッケンロー★サミット2025 フライヤー">
  </div>
  <div class="flyer-tape"></div>
</a>
```

`href` をフルサイズ画像にしておくとクリックでライトボックスに大きく表示されます。

### ② ライブ映像（MOVIE セクション）

```html
<a href="https://youtu.be/xxxx" target="_blank" rel="noopener" class="movie-card">
  <div class="movie-thumb" style="background-image:url('img/movie-2025.jpg');background-size:cover">
    <span class="play-icon">▶</span>
  </div>
  <div class="movie-meta">2025 LIVE DIGEST</div>
</a>
```

### ③ ライブ写真（GALLERY セクション）

```html
<div class="gallery-item">
  <img src="img/gallery-001.jpg" alt="ライブ写真">
</div>
```

### ④ インタビュー（INTERVIEW セクション）

PINHEAD と CD Journal P4 の周りの白フチをカットした画像を `img/` に置き、
`.interview-thumb` を以下のように差し替えてください。

```html
<a href="img/interview-pinhead-large.jpg" class="interview-card">
  <div class="interview-thumb">
    <img src="img/interview-pinhead.jpg" alt="PINHEAD 掲載記事">
  </div>
  <div class="interview-meta">PINHEAD 掲載記事</div>
</a>
```

### ⑤ NEWS の追加

`#news .news-list` 内に `<article class="news-item">` を追加するだけで増やせます。

## 動作確認

`index.html` をブラウザで開けばそのまま動きます。
サーバーにアップする場合は `index.html` `style.css` `script.js` `img/` を
同じ階層にアップしてください。
