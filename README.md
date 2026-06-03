# NEON TYPE - 爽快スタイリッシュタイピングゲーム

![NEON TYPE](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop) *(※イメージ画像)*

**NEON TYPE（ネオン・タイプ）** は、美しいダークネオンデザインと、キーを叩くたびに鳴る心地よい打鍵音が楽しめる、ブラウザで遊べるタイピング練習ゲームです。

初心者でも直感的に楽しめるシンプルな操作性でありながら、モダンで未来感のあるビジュアル（ガラスモーフィズム）を採用しています。

---

## 🌟 主な特徴

1. **プレミアムなデザイン（ダークネオン & ガラスモーフィズム）**
   すりガラスのように背景が美しく透けるエフェクトと、鮮やかなネオンのグラデーションアニメーションを融合させた、近未来的なデザインです。
2. **Web Audio APIによる心地よいサウンドエフェクト**
   キーを叩いたときの小気味よい打鍵音やミスしたときの警告音、終了時のファンファーレは、すべてJavaScriptコード上で直接音波を合成して鳴らしています。音声アセットの読み込みエラーが発生せず、常に軽快に動作します。
3. **選べる3つのカテゴリ（難易度）**
   日常単語（やさしい）、プログラミング用語（普通）、短い文章（難しい）の3つのカテゴリから選択して遊ぶことができます。
4. **リアルタイムな指標計算**
   タイピング速度を示す WPM（Words Per Minute：1分間あたりの正解入力文字数）や正確性をリアルタイムで計算・表示します。
5. **ワンクリック結果コピー & シェア機能**
   ゲーム終了後、スコアをワンクリックでクリップボードにコピーできます。そのままSNS（X/Twitterなど）に貼り付けて友達と競い合うことができます。

---

## 📂 ディレクトリ構成

本プロジェクトは以下の3つの主要ファイルとドキュメントのみで構成されており、非常にシンプルで改変しやすくなっています。

```text
typing-game/
├── index.html   # ゲームの画面構造・メタデータ定義
├── style.css    # デザインシステム・アニメーション定義
├── app.js       # ゲーム進行ロジック・音源合成処理
└── README.md    # プロジェクトの説明書（本ファイル）
```

---

## 🚀 使い方（遊び方）

### ローカル（PC）で遊ぶ場合
1. このプロジェクトのフォルダをダウンロードまたはクローンします。
2. フォルダ内にある `index.html` ファイルをダブルクリックして、Google ChromeやMicrosoft Edgeなどのブラウザで開きます。
3. カテゴリを選んで **「GAME START」** をクリックするとタイピングが始まります。

---

## 🌐 Web上にデプロイ（公開）する方法

### 1. Netlifyにデプロイする場合（おすすめ）
1. [Netlify](https://www.netlify.com/) にログインまたはアカウント登録します。
2. 管理画面のデプロイエリアに、本プロジェクトフォルダ（`typing-game`）をそのまま**ドラッグ＆ドロップ**します。
3. 数秒で専用のURLが発行され、世界中に公開されます。

### 2. GitHub Pagesにデプロイする場合
1. GitHubで新しいパブリックリポジトリを作成し、このフォルダ内のファイルをプッシュ（アップロード）します。
2. リポジトリの **Settings (設定)** ＞ **Pages** に移動します。
3. **Build and deployment** の Source に `Deploy from a branch` を選択し、Branch を `main` (または `master`) に設定して **Save (保存)** します。
4. 数分待つと、自動的にゲームのWebサイトが公開されます。

---

## 🛠️ 技術解説（開発者・学習者向け）

### ガラスモーフィズムの実現
CSSの `backdrop-filter: blur(24px)` を使用し、背景の光をぼかしながら透過させるエフェクトを実装しています。
```css
.glass-panel {
    background: rgba(13, 17, 33, 0.65);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.08);
}
```

### Web Audio API による音波合成
以下のようにJavaScript内で直接音の高さ（周波数）や減衰速度を指定して、電子音をその場で発生させています。
```javascript
const osc = audioCtx.createOscillator();
const gain = audioCtx.createGain();
osc.connect(gain);
gain.connect(audioCtx.destination);
osc.frequency.setValueAtTime(1000, audioCtx.currentTime); // 1000Hz
gain.gain.setValueAtTime(0.08, audioCtx.currentTime); // 音量
gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05); // 0.05秒で消音
osc.start();
osc.stop(audioCtx.currentTime + 0.05);
```

---

## 📝 ライセンス
本プロジェクトは MITライセンスのもとで公開されています。個人利用、商用利用、改変、再配布など自由に行っていただいて構いません。
