# おこづかい帳

じぶんの「何にいくら」を見える化しよう！

支出記録用のPWA（ホーム画面に追加してアプリのように使えるWebアプリ）です。
データはすべて**自分のスマホの中だけ**に保存されます。サーバーもログインもありません。

## できること

- **記録する** — 金額・費目（9種類）・日付・メモを入力してワンタップ記録、最近の記録8件
- **今月** — 月の合計、費目ごとの内訳バー＆円グラフ、明細一覧（月の切り替え可）
- **一年** — 年間累計と月平均、月ごとの棒グラフ、費目ランキング（年の切り替え可）
- **設定**（右上の歯車）— JSONバックアップの保存／復元、データ全消去

## ファイル構成

```
index.html            アプリ本体
manifest.json         PWAマニフェスト
sw.js                 Service Worker（オフライン対応）
icon-source.jpg       アイコン（元画像）
icon-192.png          PWAアイコン
icon-512.png          PWAアイコン
apple-touch-icon.png  iPhoneホーム画面用アイコン
okozukai_app.jsx      元になったReact版（土台。アプリ本体には不要）
```

## GitHub Pagesで公開する手順

1. [GitHub](https://github.com) にログインし、右上の「＋」→「New repository」
2. リポジトリ名を入力（例: `okozukai`）。**Public** を選んで「Create repository」
3. 「uploading an existing file」リンクをクリックし、このフォルダの
   `index.html` `manifest.json` `sw.js` `icon-192.png` `icon-512.png` `apple-touch-icon.png`
   をまとめてドラッグ＆ドロップ →「Commit changes」
4. リポジトリの **Settings → Pages** を開く
5. 「Source」を **Deploy from a branch**、Branch を **main** / **(root)** にして「Save」
6. 1〜2分待つと `https://＜ユーザー名＞.github.io/okozukai/` で公開されます

> 更新するときは同じファイルをアップロードし直すだけです。
> Service Workerのキャッシュが残る場合は、`sw.js` の `okozukai-v1` を `v2` に上げてください。

## iPhoneで「ホーム画面に追加」する手順

1. **Safari** で公開したURLを開く（Chromeではなく必ずSafariで）
2. 画面下の **共有ボタン**（四角から矢印が出ているアイコン）をタップ
3. メニューを下にスクロールして **「ホーム画面に追加」** をタップ
4. 名前（おこづかい帳）を確認して **「追加」**
5. ホーム画面にアイコンが増えます。以後はそこから起動すると全画面で開き、オフラインでも動きます

## 機種変更・バックアップ

スマホを変えるとデータは自動では引き継がれません。

1. 旧端末: 設定（右上の歯車）→ **バックアップを保存（JSON）** でファイルを保存し、AirDropやメールで新端末へ
2. 新端末: アプリを開いて 設定 → **バックアップから復元（JSON）** でそのファイルを選ぶ

ときどき保存しておくと安心です。
