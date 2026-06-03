/* ==========================================================================
   NEON TYPE - ゲームロジック & サウンドエフェクト (JavaScript)
   ========================================================================== */

// --- 1. タイピング用お題データ（カテゴリ別） ---
const WORD_CATEGORIES = {
    'words-easy': [
        { ja: 'こんにちは', roma: 'konnichiha' },
        { ja: 'ありがとう', roma: 'arigatou' },
        { ja: 'おはようございます', roma: 'ohayougozaimasu' },
        { ja: 'いただきます', roma: 'itadakimasu' },
        { ja: 'ごちそうさまでした', roma: 'gochousamadeshita' },
        { ja: 'おやすみなさい', roma: 'oyasuminasai' },
        { ja: 'よろしくおねがいします', roma: 'yoroshikuonegaishimasu' },
        { ja: 'おつかれさまでした', roma: 'otsukaresamadeshita' },
        { ja: 'ただいま', roma: 'tadaima' },
        { ja: 'おかえりなさい', roma: 'okaerinasai' }
    ],
    'words-programming': [
        { ja: 'プログラム', roma: 'puroguramu' },
        { ja: 'ファンクション', roma: 'fankushon' },
        { ja: 'デバッグ', roma: 'debaggu' },
        { ja: 'データベース', roma: 'de-tabe-su' },
        { ja: 'アプリケーション', roma: 'apurike-shon' },
        { ja: 'コンソール', roma: 'konso-ru' },
        { ja: 'アルゴリズム', roma: 'arugorizumu' },
        { ja: 'クラス', roma: 'kurasu' },
        { ja: 'オブジェクト', roma: 'obujekuto' },
        { ja: 'インデックス', roma: 'indekkusu' }
    ],
    'words-sentences': [
        { ja: '明日天気になれ', roma: 'ashitatenkininare' },
        { ja: '終わりよければすべてよし', roma: 'owariyokerebasubeteyoshi' },
        { ja: '習うより慣れよ', roma: 'narauyorinareyo' },
        { ja: '継続は力なり', roma: 'keizokuhachikaranari' },
        { ja: '失敗は成功のもと', roma: 'shippaihaseikounomoto' },
        { ja: '百聞は一見にしかず', roma: 'hyakubunhaikkenndashikazu' },
        { ja: '急がば回れ', roma: 'isogabamaware' },
        { ja: '情けは人のためならず', roma: 'nasakehahitonotamenarazu' }
    ]
};

// --- 2. グローバル状態（変数） ---
let currentCategory = 'words-easy';
let wordList = [];
let currentWordIndex = 0;
let currentCharIndex = 0; // 現在のお題文字内のインデックス

let timeLeft = 60;
let timerId = null;
let isPlaying = false;

// 統計データ
let totalCorrectKeys = 0;
let totalMissKeys = 0;
let gameStartTime = null;

// オーディオコンテキスト（音源を合成するオブジェクト）
let audioCtx = null;

// --- 3. DOM（画面要素）の取得 ---
const gameContainer = document.getElementById('game-container');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

// 操作系
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const shareBtn = document.getElementById('share-btn');
const categorySelect = document.getElementById('category-select');

// 表示系
const timerDisplay = document.getElementById('timer-display');
const wpmDisplay = document.getElementById('wpm-display');
const accuracyDisplay = document.getElementById('accuracy-display');
const wordJapanese = document.getElementById('word-japanese');
const wordRoma = document.getElementById('word-roma');

// リザルト表示系
const resultWpm = document.getElementById('result-wpm');
const resultAccuracy = document.getElementById('result-accuracy');
const resultCorrect = document.getElementById('result-correct');
const resultMiss = document.getElementById('result-miss');

// トースト通知
const toast = document.getElementById('toast-notification');

// --- 4. Web Audio API によるシンセサイザー効果音の生成 ---

// 音声再生が初期化されているか確認・生成する関数
function initAudio() {
    if (!audioCtx) {
        // ブラウザの互換性に対応したAudioContextの作成
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Safariなどのブラウザで一時停止状態になっているのを解除
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// タイプ成功音（軽快で短い「プツッ」という高音）
function playTypeSound() {
    if (!audioCtx) return;
    
    // オシレーター（発振器：音の波を生成）とゲインノード（音量調整）を作成
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sine'; // 正弦波（滑らかな音）
    osc.frequency.setValueAtTime(1000, audioCtx.currentTime); // 1000Hzの高音
    
    // 音量のエンベロープ（時間経過による音量変化）を設定して短い余韻を作る
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05); // 0.05秒で消音
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

// タイプミス音（少し濁った低めの「ブッ」という音）
function playMissSound() {
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'triangle'; // 三角波（少し角の取れた柔らかい矩形音）
    osc.frequency.setValueAtTime(120, audioCtx.currentTime); // 120Hzの低音
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15); // 0.15秒で消音
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

// ゲーム終了音（ピロポロポーンというファンファーレ音）
function playFinishSound() {
    if (!audioCtx) return;
    
    const now = audioCtx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 (ド・ミ・ソ・ド)
    
    notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.12);
        
        const startTime = now + index * 0.12;
        const duration = 0.4;
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
    });
}

// --- 5. ゲームフロー制御 ---

// ゲーム開始
function startGame() {
    initAudio(); // 音声再生の準備
    isPlaying = true;
    
    // 設定の読み込み
    currentCategory = categorySelect.value;
    // 選択されたカテゴリのワードリストをシャッフルして複製
    wordList = shuffleArray([...WORD_CATEGORIES[currentCategory]]);
    
    currentWordIndex = 0;
    currentCharIndex = 0;
    timeLeft = 60;
    totalCorrectKeys = 0;
    totalMissKeys = 0;
    gameStartTime = Date.now();
    
    // UI初期表示の更新
    timerDisplay.textContent = timeLeft;
    wpmDisplay.textContent = 0;
    accuracyDisplay.textContent = '100%';
    document.getElementById('timer-box').classList.remove('timer-warning');
    
    // 画面切り替え
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // お題表示
    displayNextWord();
    
    // タイマー開始
    if (timerId) clearInterval(timerId);
    timerId = setInterval(updateTimer, 1000);
}

// 配列をランダムにシャッフルするアルゴリズム
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// タイマー更新
function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    
    // 残り時間10秒以下でタイマーを赤色に発光させて警告
    if (timeLeft <= 10) {
        document.getElementById('timer-box').classList.add('timer-warning');
    }
    
    if (timeLeft <= 0) {
        endGame();
    }
}

// ゲーム終了
function endGame() {
    isPlaying = false;
    clearInterval(timerId);
    playFinishSound();
    
    // 画面切り替え
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    // スコア計算
    const durationMin = 1.0; // 60秒＝1分固定
    const wpm = Math.round(totalCorrectKeys / durationMin);
    
    const totalKeys = totalCorrectKeys + totalMissKeys;
    const accuracy = totalKeys === 0 ? 0 : Math.round((totalCorrectKeys / totalKeys) * 100);
    
    // 結果表示の反映
    resultWpm.textContent = wpm;
    resultAccuracy.textContent = `${accuracy}%`;
    resultCorrect.textContent = totalCorrectKeys;
    resultMiss.textContent = totalMissKeys;
}

// 次のお題を表示
function displayNextWord() {
    if (currentWordIndex >= wordList.length) {
        // ワードリストを使い切ったら、再度シャッフルしてリセット
        wordList = shuffleArray([...WORD_CATEGORIES[currentCategory]]);
        currentWordIndex = 0;
    }
    
    const currentWord = wordList[currentWordIndex];
    wordJapanese.textContent = currentWord.ja;
    currentCharIndex = 0;
    
    renderRomaText();
}

// ローマ字テキストをレンダリング（入力済み、未入力を視覚化）
function renderRomaText() {
    const currentWord = wordList[currentWordIndex];
    const roma = currentWord.roma;
    
    wordRoma.innerHTML = '';
    
    for (let i = 0; i < roma.length; i++) {
        const span = document.createElement('span');
        span.textContent = roma[i];
        
        if (i < currentCharIndex) {
            // すでに入力された文字
            span.className = 'typed';
        } else if (i === currentCharIndex) {
            // 現在タイピングすべきターゲット文字
            span.className = 'current-target';
        } else {
            // まだ入力していない先の文字
            span.className = 'untyped';
        }
        wordRoma.appendChild(span);
    }
}

// リアルタイムステータスの計算・表示更新
function updateLiveStats() {
    const elapsedSeconds = (Date.now() - gameStartTime) / 1000;
    const elapsedMinutes = elapsedSeconds / 60;
    
    // WPM (1分間あたりのタイピング速度)
    const wpm = elapsedMinutes > 0 ? Math.round(totalCorrectKeys / elapsedMinutes) : 0;
    wpmDisplay.textContent = wpm;
    
    // 正確性
    const totalKeys = totalCorrectKeys + totalMissKeys;
    const accuracy = totalKeys === 0 ? 100 : Math.round((totalCorrectKeys / totalKeys) * 100);
    accuracyDisplay.textContent = `${accuracy}%`;
}

// ミスタイプ時の視覚的フィードバック（パネルの揺れ）
function triggerMissFeedback() {
    gameContainer.classList.add('shake-panel');
    setTimeout(() => {
        gameContainer.classList.remove('shake-panel');
    }, 250); // アニメーション時間に合わせてクラスを削除
}

// --- 6. イベントリスナー ---

// キー入力イベント
window.addEventListener('keydown', (e) => {
    // ゲームプレイ中かつ、修飾キー（Ctrl, Alt, Shift, Metaなど）が押されていない場合のみ判定
    if (!isPlaying) return;
    if (e.key.length !== 1) return; // 1文字キー（アルファベット、記号など）以外は無視

    // 大文字小文字の違いを考慮して、小文字で比較
    const inputKey = e.key.toLowerCase();
    const currentWord = wordList[currentWordIndex];
    const targetKey = currentWord.roma[currentCharIndex].toLowerCase();
    
    if (inputKey === targetKey) {
        // 正しくタイプされた場合
        totalCorrectKeys++;
        currentCharIndex++;
        playTypeSound();
        
        // お題の中の全文字をタイピング完了したか判定
        if (currentCharIndex >= currentWord.roma.length) {
            currentWordIndex++;
            displayNextWord();
        } else {
            renderRomaText();
        }
    } else {
        // ミスタイプした場合
        totalMissKeys++;
        playMissSound();
        triggerMissFeedback();
    }
    
    // リアルタイム指標を更新
    updateLiveStats();
});

// コピーボタンで結果を共有用にクリップボードにコピー
shareBtn.addEventListener('click', () => {
    const wpm = resultWpm.textContent;
    const accuracy = resultAccuracy.textContent;
    const correct = resultCorrect.textContent;
    const miss = resultMiss.textContent;
    const categoryName = categorySelect.options[categorySelect.selectedIndex].text;
    
    const shareText = 
`【NEON TYPE結果】
カテゴリ: ${categoryName}
入力速度 (WPM): ${wpm} 文字/分
正確率: ${accuracy}
正解キー数: ${correct} 回
ミスキー数: ${miss} 回
#NEON_TYPE #タイピング練習
`;

    // クリップボードAPIを使用してコピー
    navigator.clipboard.writeText(shareText).then(() => {
        // トースト通知を表示
        toast.className = 'toast-hidden show';
        setTimeout(() => {
            toast.className = 'toast-hidden';
        }, 3000);
    }).catch(err => {
        console.error('コピーに失敗しました: ', err);
    });
});

// 各ボタンの紐付け
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// カテゴリ変更時に音声を初期化するトリガー（UX上のきっかけ作り）
categorySelect.addEventListener('change', () => {
    initAudio();
});
