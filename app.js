/* ==========================================================================
   NEON TYPE - ゲームロジック & サウンドエフェクト (究極アップグレード版)
   ========================================================================== */

// --- 1. ローマ字表記揺れ変換用マッピング ---
const ROMAN_MAP = {
    'あ': ['a'], 'い': ['i', 'yi'], 'う': ['u', 'wu'], 'え': ['e', 'ye'], 'お': ['o'],
    'か': ['ka', 'ca'], 'き': ['ki'], 'く': ['ku', 'cu', 'qu'], 'け': ['ke'], 'こ': ['ko', 'co'],
    'さ': ['sa'], 'し': ['si', 'shi'], 'す': ['su'], 'せ': ['se', 'ce'], 'そ': ['so'],
    'た': ['ta'], 'ち': ['ti', 'chi'], 'つ': ['tu', 'tsu'], 'て': ['te'], 'と': ['to'],
    'な': ['na'], 'に': ['ni'], 'ぬ': ['nu'], 'ね': ['ne'], 'の': ['no'],
    'は': ['ha'], 'ひ': ['hi'], 'ふ': ['fu', 'hu'], 'へ': ['he'], 'ほ': ['ho'],
    'ま': ['ma'], 'み': ['mi'], 'む': ['mu'], 'め': ['me'], 'も': ['mo'],
    'や': ['ya'], 'ゆ': ['yu'], 'よ': ['yo'],
    'ら': ['ra'], 'り': ['ri'], 'る': ['ru'], 'れ': ['re'], 'ろ': ['ro'],
    'わ': ['wa'], 'を': ['wo'], 'ん': ['nn', 'xn', 'n'],
    // 濁音・半濁音
    'が': ['ga'], 'ぎ': ['gi'], 'ぐ': ['gu'], 'げ': ['ge'], 'ご': ['go'],
    'ざ': ['za'], 'じ': ['zi', 'ji'], 'ず': ['zu'], 'ぜ': ['ze'], 'ぞ': ['zo'],
    'だ': ['da'], 'ぢ': ['di'], 'づ': ['du'], 'で': ['de'], 'ど': ['do'],
    'ば': ['ba'], 'び': ['bi'], 'ぶ': ['bu'], 'べ': ['be'], 'ぼ': ['bo'],
    'ぱ': ['pa'], 'ぴ': ['pi'], 'ぷ': ['pu'], 'ぺ': ['pe'], 'ぽ': ['po'],
    // 拗音
    'きゃ': ['kya'], 'きゅ': ['kyu'], 'きょ': ['kyo'],
    'しゃ': ['sya', 'sha'], 'しゅ': ['syu', 'shu'], 'しょ': ['syo', 'sho'],
    'ちゃ': ['tya', 'cha'], 'ちゅ': ['tyu', 'chu'], 'ちょ': ['tyo', 'cho'],
    'にゃ': ['nya'], 'にゅ': ['nyu'], 'にょ': ['nyo'],
    'ひゃ': ['hya'], 'ひゅ': ['hyu'], 'ひょ': ['hyo'],
    'みゃ': ['mya'], 'みゅ': ['myu'], 'みょ': ['myo'],
    'りゃ': ['rya'], 'りゅ': ['ryu'], 'りょ': ['ryo'],
    'ぎゃ': ['gya'], 'ぎゅ': ['gyu'], 'ぎょ': ['gyo'],
    'じゃ': ['zya', 'ja', 'jya'], 'じゅ': ['zyu', 'ju', 'jyu'], 'じょ': ['zyo', 'jo', 'jyo'],
    'びゃ': ['bya'], 'びゅ': ['byu'], 'びょ': ['byo'],
    'ぴゃ': ['pya'], 'ぴゅ': ['pyu'], 'ぴょ': ['pyo'],
    // 特殊小文字・外来語
    'ぁ': ['la', 'xa'], 'ぃ': ['li', 'xi'], 'ぅ': ['lu', 'xu'], 'ぇ': ['le', 'xe'], 'ぉ': ['lo', 'xo'],
    'っ': ['ltu', 'xtu', 'ltsu'], 'ゃ': ['lya', 'xya'], 'ゅ': ['lyu', 'xyu'], 'ょ': ['lyo', 'xyo'],
    'ー': ['-'],
    'いぇ': ['ye'], 'うぃ': ['wi'], 'うぇ': ['we'], 'うぉ': ['who'],
    'ヴ': ['vu'], 'ヴァ': ['va'], 'ヴィ': ['vi'], 'ヴェ': ['ve'], 'ヴォ': ['vo'],
    'ふぁ': ['fa', 'fua'], 'ふぃ': ['fi', 'fui'], 'ふぇ': ['fe', 'fue'], 'ふぉ': ['fo', 'fuo'],
    'でぃ': ['dhi'], 'てぃ': ['thi'], 'じぇ': ['je', 'zye'], 'ちぇ': ['che', 'tye'], 'しぇ': ['she', 'sye']
};

// --- 2. タイピングお題辞書（漢字とひらがなを定義） ---
const WORD_DICTIONARY = {
    'words-easy': [
        { ja: 'こんにちは', kana: 'こんにちは' },
        { ja: 'ありがとう', kana: 'ありがとう' },
        { ja: 'おはようございます', kana: 'おはようございます' },
        { ja: 'いただきます', kana: 'いただきます' },
        { ja: 'ごちそうさまでした', kana: 'ごちそうさまでした' },
        { ja: 'おやすみなさい', kana: 'おやすみなさい' },
        { ja: 'よろしくおねがいします', kana: 'よろしくおねがいします' },
        { ja: 'お疲れ様でした', kana: 'おつかれさまでした' },
        { ja: 'ただいま', kana: 'ただいま' },
        { ja: 'おかえりなさい', kana: 'おかえりなさい' }
    ],
    'words-programming': [
        { ja: 'プログラム', kana: 'ぷろぐらむ' },
        { ja: '関数 (ファンクション)', kana: 'ふぁんくしょん' },
        { ja: 'デバッグ', kana: 'でばっぐ' },
        { ja: 'データベース', kana: 'でーたべーす' },
        { ja: 'アプリケーション', kana: 'あぷりけーしょん' },
        { ja: 'コンソール', kana: 'こんそーる' },
        { ja: 'アルゴリズム', kana: 'あるごりずむ' },
        { ja: 'クラス', kana: 'くらす' },
        { ja: 'オブジェクト', kana: 'おぶじぇくと' },
        { ja: 'インデックス', kana: 'いんでっくす' }
    ],
    'words-sentences': [
        { ja: '明日天気になれ', kana: 'あしたてんきになれ' },
        { ja: '終わりよければすべてよし', kana: 'おわりよければすべてよし' },
        { ja: '習うより慣れよ', kana: 'ならうよりなれよ' },
        { ja: '継続は力なり', kana: 'けいぞくはちからなり' },
        { ja: '失敗は成功のもと', kana: 'しっぱいはせいこうのもと' },
        { ja: '百聞は一見にしかず', kana: 'ひゃくぶんはいっけんにしかず' },
        { ja: '急がば回れ', kana: 'いそがばまわれ' },
        { ja: '情けは人のためならず', kana: 'なさけはひとのためならず' }
    ]
};

// --- 3. グローバル状態（ゲームシステム） ---
let currentCategory = 'words-easy';
let wordList = [];
let currentWordIndex = 0;

let timeLeft = 60;
let timerId = null;
let isPlaying = false;

// 統計
let totalCorrectKeys = 0;
let totalMissKeys = 0;
let currentCombo = 0;
let gameStartTime = null;

// セーブデータ（初期プロファイル）
let playerProfile = {
    level: 1,
    xp: 0,
    bestScores: {
        'words-easy': 0,
        'words-programming': 0,
        'words-sentences': 0
    }
};

// --- 4. 表記揺れ対応タイピングエンジン (Trie木モデル) ---
class TrieNode {
    constructor() {
        this.children = {}; // key: 入力文字 (例: 's'), value: TrieNode
        this.isEnd = false; // 文末フラグ
    }
}

// ひらがなをトークン（1〜2文字）に分割
function parseKanaToTokens(kana) {
    const tokens = [];
    let i = 0;
    while (i < kana.length) {
        // 2文字の拗音チェック (例: しゃ)
        if (i + 1 < kana.length) {
            const doubleChar = kana.substring(i, i + 2);
            if (ROMAN_MAP[doubleChar]) {
                tokens.push(doubleChar);
                i += 2;
                continue;
            }
        }
        tokens.push(kana[i]);
        i++;
    }

    // 「っ（促音）」と次文字の合体処理
    const processed = [];
    for (let j = 0; j < tokens.length; j++) {
        if (tokens[j] === 'っ' && j + 1 < tokens.length) {
            processed.push({
                type: 'sokuon',
                char: 'っ',
                next: tokens[j + 1]
            });
            j++; // 次の文字は合体したのでスキップ
        } else {
            processed.push({
                type: 'normal',
                char: tokens[j]
            });
        }
    }
    return processed;
}

// トークン配列から、すべての許容されるローマ字文字列を生成 (デカルト積)
function generateRomaList(processedTokens) {
    let results = [''];

    for (let j = 0; j < processedTokens.length; j++) {
        const token = processedTokens[j];
        let candidates = [];

        if (token.type === 'normal') {
            const char = token.char;
            let list = [...(ROMAN_MAP[char] || [char])];

            // 「ん」の動的許容処理
            if (char === 'ん') {
                const nextToken = processedTokens[j + 1];
                let isSpecial = false; // 次の文字が母音・な行・や行なら 'n' 単体は不可
                if (nextToken && nextToken.type === 'normal') {
                    const nc = nextToken.char;
                    isSpecial = 'あいうえおなにぬねのやゆよ'.includes(nc) ||
                                (ROMAN_MAP[nc] && ROMAN_MAP[nc].some(r => 'aeiouy'.includes(r[0]) || r.startsWith('n')));
                }
                if (isVowelOrNFamily(nextToken)) {
                    list = ['nn', 'xn'];
                } else {
                    list = ['nn', 'xn', 'n'];
                }
            }
            candidates = list;
        } else if (token.type === 'sokuon') {
            const nextChar = token.next;
            const nextList = ROMAN_MAP[nextChar] || [nextChar];
            const list = [];

            // パターン1: 次の子音を重ねる (例: kku, ssha)
            nextList.forEach(roma => {
                const first = roma[0];
                if (first && !'aeiouyn-'.includes(first)) {
                    list.push(first + roma);
                }
            });

            // パターン2: 単体「っ」+ 次の文字 (例: ltuku)
            const sokuonSingles = ['ltu', 'xtu', 'ltsu'];
            sokuonSingles.forEach(s => {
                nextList.forEach(roma => {
                    list.push(s + roma);
                });
            });

            candidates = list;
        }

        // デカルト積の結合
        const nextResults = [];
        results.forEach(r => {
            candidates.forEach(c => {
                nextResults.push(r + c);
            });
        });
        results = nextResults;
    }
    return results;
}

// 次のトークンが母音、な行、や行か判定
function isVowelOrNFamily(token) {
    if (!token) return true; // 文末なら nn が必須
    if (token.type === 'sokuon') return false;
    const nc = token.char;
    return 'あいうえおなにぬねのやゆよぁぃぅぇぉゃゅょ'.includes(nc);
}

// 生成された全ローマ字パターンからTrie木を構築
function buildTrie(romaList) {
    const root = new TrieNode();
    romaList.forEach(roma => {
        let node = root;
        for (let char of roma) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEnd = true;
    });
    return root;
}

// 現在のノードから到達できる最短の残りパスを取得 (表示ガイド用)
function getShortestRemainingPath(node) {
    if (node.isEnd) return '';
    
    const queue = [{ node: node, path: '' }];
    const visited = new Set();
    visited.add(node);
    
    while (queue.length > 0) {
        const { node: currNode, path } = queue.shift();
        
        if (currNode.isEnd) {
            return path;
        }
        
        for (let char in currNode.children) {
            const nextNode = currNode.children[char];
            if (!visited.has(nextNode)) {
                visited.add(nextNode);
                queue.push({ node: nextNode, path: path + char });
            }
        }
    }
    return '';
}

// お題タイピング状態
let currentTrieRoot = null;
let currentTrieNode = null;
let typedRomaHistory = '';

// --- 5. DOMの取得 ---
const gameContainer = document.getElementById('game-container');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

// コントロール
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const shareBtn = document.getElementById('share-btn');
const categorySelect = document.getElementById('category-select');
const bgmToggleBtn = document.getElementById('bgm-toggle-btn');

// ステータス表示
const timerDisplay = document.getElementById('timer-display');
const wpmDisplay = document.getElementById('wpm-display');
const accuracyDisplay = document.getElementById('accuracy-display');
const comboDisplay = document.getElementById('combo-display');
const wordJapanese = document.getElementById('word-japanese');
const wordRoma = document.getElementById('word-roma');

// 成長表示
const playerLevel = document.getElementById('player-level');
const xpProgressBar = document.getElementById('xp-progress-bar');
const playerXpText = document.getElementById('player-xp-text');

// リザルト表示
const resultWpm = document.getElementById('result-wpm');
const resultAccuracy = document.getElementById('result-accuracy');
const resultCorrect = document.getElementById('result-correct');
const resultMiss = document.getElementById('result-miss');
const resultXp = document.getElementById('result-xp');
const highscoreBadge = document.getElementById('highscore-badge');
const toast = document.getElementById('toast-notification');

// --- 6. Canvas パーティクルシステム (極美ネオン演出) ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 3 + 2;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 2; // やや上方向に飛び散る
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.gravity = 0.15;
    }

    update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 爆発エフェクトの発生
function spawnParticles(x, y, colorType = 'blue') {
    const colors = {
        blue: ['#00f2fe', '#4facfe', '#ffffff'],
        pink: ['#ff007f', '#ff85a2', '#ffffff'],
        purple: ['#9d4edd', '#c77dff', '#ffffff']
    };
    const list = colors[colorType] || colors.blue;
    for (let i = 0; i < 20; i++) {
        const color = list[Math.floor(Math.random() * list.length)];
        particles.push(new Particle(x, y, color));
    }
}

// アニメーションループ
function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        } else {
            particles[i].draw();
        }
    }
    requestAnimationFrame(updateParticles);
}
requestAnimationFrame(updateParticles);

// キーの画面上での座標を取得して、そこからパーティクルを出す
function spawnKeyFeedback(keyChar, isSuccess) {
    const kbd = document.querySelector(`kbd[data-key="${keyChar.toLowerCase()}"]`);
    if (kbd) {
        const rect = kbd.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        spawnParticles(x, y, isSuccess ? 'blue' : 'pink');
    } else {
        // キーボードにない場合は画面中央付近のお題エリアから
        const rect = wordRoma.getBoundingClientRect();
        const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 100;
        const y = rect.top + rect.height / 2;
        spawnParticles(x, y, isSuccess ? 'blue' : 'pink');
    }
}

// --- 7. Web Audio API による動的BGM & 効果音 ---
let audioCtx = null;
let bgmIntervalId = null;
let isBgmPlaying = false;
let bgmTempo = 105; // 初期BPM
let bgmStep = 0;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// 効果音 (正解・ミス・終了音)
function playTypeSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
}

function playMissSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
}

function playFinishSound() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.08, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.5);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.5);
    });
}

function playLevelUpSound() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (超きらびやか)
    chord.forEach((freq) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
        osc.start();
        osc.stop(now + 0.8);
    });
}

// Web Audio APIによるシンセサイザー自動生成BGM (アンビエントテクノ)
function startBgm() {
    if (bgmIntervalId) clearInterval(bgmIntervalId);
    bgmStep = 0;
    
    // スケジュール用タイマー (BPMに応じた秒数ごとにトリガー)
    const stepDuration = () => 60 / bgmTempo / 2; // 8分音符の間隔
    
    function scheduler() {
        if (!isBgmPlaying || !isPlaying || !audioCtx) return;
        
        // ベースコード進行 (Am - F - C - G)
        const chordProgress = [
            [220.00, 110.00], // Am (A3, A2)
            [174.61, 87.31],  // F (F3, F2)
            [261.63, 130.81], // C (C3, C2)
            [196.00, 98.00]   // G (G3, G2)
        ];
        
        const currentChordIndex = Math.floor(bgmStep / 8) % 4;
        const chord = chordProgress[currentChordIndex];
        
        // --- 1. ドラム（4つ打ちの簡易キック） ---
        if (bgmStep % 4 === 0) {
            triggerKick();
        }
        
        // --- 2. シンセベース（8分音符でバウンス） ---
        if (bgmStep % 2 === 0) {
            const baseFreq = bgmStep % 8 === 6 ? chord[0] : chord[1];
            triggerBass(baseFreq);
        }
        
        // --- 3. きらびやかなメロディアルペジオ (16分音符ライクにランダムに)
        if (Math.random() > 0.4 && bgmStep % 2 !== 0) {
            const arpeggioNotes = [
                [220, 261, 329, 392], // Am7
                [174, 220, 261, 349], // Fmaj7
                [261, 329, 392, 493], // Cmaj7
                [196, 246, 293, 392]  // G7
            ];
            const notes = arpeggioNotes[currentChordIndex];
            const randomFreq = notes[Math.floor(Math.random() * notes.length)] * 2; // 1オクターブ上げ
            triggerArpeggio(randomFreq);
        }
        
        bgmStep++;
        
        // 次のステップをスケジューリング
        setTimeout(scheduler, stepDuration() * 1000);
    }
    
    scheduler();
}

function triggerKick() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15); // ドスンと落とす
    
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

function triggerBass(freq) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sawtooth'; // 鋸歯状波
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // 簡単なローパスフィルターで高音を丸めてベースっぽく
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;
    osc.disconnect(gain);
    osc.connect(filter);
    filter.connect(gain);
    
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
}

function triggerArpeggio(freq) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.012, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

// BGM再生トグル
bgmToggleBtn.addEventListener('click', () => {
    initAudio();
    isBgmPlaying = !isBgmPlaying;
    
    if (isBgmPlaying) {
        bgmToggleBtn.classList.add('active');
        bgmToggleBtn.innerHTML = '🔊 BGM ON';
        startBgm();
    } else {
        bgmToggleBtn.classList.remove('active');
        bgmToggleBtn.innerHTML = '🔇 BGM OFF';
    }
});

// --- 8. 成長システム ＆ localStorage セーブ機能 ---
function loadProfile() {
    const saved = localStorage.getItem('neon_type_profile');
    if (saved) {
        try {
            playerProfile = JSON.parse(saved);
        } catch (e) {
            console.error('セーブデータのロードに失敗しました', e);
        }
    }
    updateProfileUI();
    displayBestScores();
}

function saveProfile() {
    localStorage.setItem('neon_type_profile', JSON.stringify(playerProfile));
}

function updateProfileUI() {
    playerLevel.textContent = `Lv.${playerProfile.level}`;
    const nextLevelXp = playerProfile.level * 100;
    const progressPercent = Math.min((playerProfile.xp / nextLevelXp) * 100, 100);
    xpProgressBar.style.width = `${progressPercent}%`;
    playerXpText.textContent = `${playerProfile.xp} / ${nextLevelXp} XP`;
}

function displayBestScores() {
    const categories = ['words-easy', 'words-programming', 'words-sentences'];
    categories.forEach(cat => {
        const score = playerProfile.bestScores[cat] || 0;
        const domId = cat === 'words-easy' ? 'best-easy' : 
                      cat === 'words-programming' ? 'best-programming' : 'best-sentences';
        const el = document.getElementById(domId);
        if (el) {
            el.textContent = score > 0 ? `${score} WPM` : '- WPM';
        }
    });
}

// 経験値(XP)の獲得処理
function earnXp(amount) {
    playerProfile.xp += amount;
    let nextLevelXp = playerProfile.level * 100;
    let leveledUp = false;
    
    // レベルアップ判定ループ（一気に複数レベルアップにも対応）
    while (playerProfile.xp >= nextLevelXp) {
        playerProfile.xp -= nextLevelXp;
        playerProfile.level++;
        nextLevelXp = playerProfile.level * 100;
        leveledUp = true;
    }
    
    saveProfile();
    updateProfileUI();
    
    if (leveledUp) {
        playLevelUpSound();
        // 画面全体に虹色のパーティクルを大爆発させる
        for (let k = 0; k < 5; k++) {
            setTimeout(() => {
                spawnParticles(canvas.width / 2 + (Math.random() - 0.5) * 300, canvas.height / 2 + (Math.random() - 0.5) * 100, 'purple');
                spawnParticles(canvas.width / 2 + (Math.random() - 0.5) * 300, canvas.height / 2 + (Math.random() - 0.5) * 100, 'blue');
            }, k * 150);
        }
    }
}

// --- 9. ゲームフロー制御 ---

function startGame() {
    initAudio();
    isPlaying = true;
    
    currentCategory = categorySelect.value;
    wordList = shuffleArray([...WORD_DICTIONARY[currentCategory]]);
    
    currentWordIndex = 0;
    timeLeft = 60;
    totalCorrectKeys = 0;
    totalMissKeys = 0;
    currentCombo = 0;
    gameStartTime = Date.now();
    bgmTempo = 105; // BPM初期化
    
    // UI初期化
    timerDisplay.textContent = timeLeft;
    wpmDisplay.textContent = 0;
    accuracyDisplay.textContent = '100%';
    comboDisplay.textContent = 0;
    document.getElementById('timer-box').classList.remove('timer-warning');
    highscoreBadge.classList.add('hidden');
    
    // 画面切り替え
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // 最初のお題表示
    displayNextWord();
    
    // タイマー開始
    if (timerId) clearInterval(timerId);
    timerId = setInterval(updateTimer, 1000);

    // BGM自動開始（BGM ONのとき）
    if (isBgmPlaying) {
        startBgm();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    
    // BGMのテンポを残り時間に応じて加速 (緊張感アップ演出)
    if (timeLeft <= 15) {
        bgmTempo = 128; // BPMをアップ
    } else if (timeLeft <= 30) {
        bgmTempo = 116;
    }
    
    if (timeLeft <= 10) {
        document.getElementById('timer-box').classList.add('timer-warning');
    }
    
    if (timeLeft <= 0) {
        endGame();
    }
}

function endGame() {
    isPlaying = false;
    clearInterval(timerId);
    playFinishSound();
    
    // ガイドキー消去
    clearKeyboardHighlights();
    
    // 画面切り替え
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    // スコア計算
    const durationMin = 1.0; // 60秒＝1分固定
    const wpm = Math.round(totalCorrectKeys / durationMin);
    
    const totalKeys = totalCorrectKeys + totalMissKeys;
    const accuracy = totalKeys === 0 ? 0 : Math.round((totalCorrectKeys / totalKeys) * 100);
    
    resultWpm.textContent = wpm;
    resultAccuracy.textContent = `${accuracy}%`;
    resultCorrect.textContent = totalCorrectKeys;
    resultMiss.textContent = totalMissKeys;
    
    // XP計算とセーブ
    const comboBonus = Math.round(totalCorrectKeys * 0.1); // 入力数に応じたコンボ賞
    const earnedXpAmount = Math.round(totalCorrectKeys * 1.2 + accuracy * 0.5);
    resultXp.textContent = `+${earnedXpAmount} XP`;
    earnXp(earnedXpAmount);
    
    // ハイスコア更新判定
    const prevBest = playerProfile.bestScores[currentCategory] || 0;
    if (wpm > prevBest) {
        playerProfile.bestScores[currentCategory] = wpm;
        saveProfile();
        highscoreBadge.classList.remove('hidden');
        displayBestScores();
    }
}

// お題表示
function displayNextWord() {
    if (currentWordIndex >= wordList.length) {
        wordList = shuffleArray([...WORD_DICTIONARY[currentCategory]]);
        currentWordIndex = 0;
    }
    
    const currentWord = wordList[currentWordIndex];
    wordJapanese.textContent = currentWord.ja;
    
    // 表記揺れ木(Trie)のビルド
    const tokens = parseKanaToTokens(currentWord.kana);
    const romaPatterns = generateRomaList(tokens);
    currentTrieRoot = buildTrie(romaPatterns);
    currentTrieNode = currentTrieRoot;
    typedRomaHistory = '';
    
    renderRomaText();
    updateKeyboardGuide();
}

// ローマ字表示のレンダリング
function renderRomaText() {
    wordRoma.innerHTML = '';
    
    // 1. これまで正しく入力し終えた文字 (シアンブルー)
    if (typedRomaHistory.length > 0) {
        const typedSpan = document.createElement('span');
        typedSpan.textContent = typedRomaHistory;
        typedSpan.className = 'typed';
        wordRoma.appendChild(typedSpan);
    }
    
    // 2. 現在のノードからの「最短の残り入力テキスト」を取得
    const remaining = getShortestRemainingPath(currentTrieNode);
    
    if (remaining.length > 0) {
        // 次に打つべき1文字 (アンダーライン・ピンク)
        const targetSpan = document.createElement('span');
        targetSpan.textContent = remaining[0];
        targetSpan.className = 'current-target';
        wordRoma.appendChild(targetSpan);
        
        // それ以降の未入力文字 (白色)
        if (remaining.length > 1) {
            const untypedSpan = document.createElement('span');
            untypedSpan.textContent = remaining.substring(1);
            untypedSpan.className = 'untyped';
            wordRoma.appendChild(untypedSpan);
        }
    }
}

// --- 10. 仮想キーボードの制御 ---

function updateKeyboardGuide() {
    clearKeyboardHighlights();
    
    if (!isPlaying || !currentTrieNode) return;
    
    // 次に入力可能なキーをTrieノードの子要素から取得して光らせる
    const nextPossibleKeys = Object.keys(currentTrieNode.children);
    nextPossibleKeys.forEach(key => {
        const kbd = document.querySelector(`kbd[data-key="${key.toLowerCase()}"]`);
        if (kbd) {
            kbd.classList.add('key-guide');
        }
    });
}

function clearKeyboardHighlights() {
    document.querySelectorAll('kbd').forEach(k => {
        k.className = '';
    });
}

function flashKeyActive(keyChar) {
    const kbd = document.querySelector(`kbd[data-key="${keyChar.toLowerCase()}"]`);
    if (kbd) {
        kbd.classList.add('key-active');
        setTimeout(() => {
            kbd.classList.remove('key-active');
            // ガイドライトを復元
            updateKeyboardGuide();
        }, 80);
    }
}

// --- 11. イベントハンドラー ---

window.addEventListener('keydown', (e) => {
    if (!isPlaying) return;
    if (e.key.length !== 1) return; // 複数文字キー（ShiftやCtrlなど）は無視
    
    const inputKey = e.key.toLowerCase();
    
    // Trie木上で入力キーが受け入れられるか検証
    if (currentTrieNode && currentTrieNode.children[inputKey]) {
        // タイピング成功！
        totalCorrectKeys++;
        currentCombo++;
        
        // コンボ加算時の視覚アニメーション
        comboDisplay.textContent = currentCombo;
        if (currentCombo > 0) {
            comboDisplay.classList.add('combo-bump');
            setTimeout(() => comboDisplay.classList.remove('combo-bump'), 100);
        }
        
        // 状態を進める
        currentTrieNode = currentTrieNode.children[inputKey];
        typedRomaHistory += e.key; // ユーザーが打ち込んだ文字そのものを追加していく
        
        playTypeSound();
        flashKeyActive(inputKey);
        spawnKeyFeedback(inputKey, true);
        
        // お題をすべて入力し終えたかチェック
        if (currentTrieNode.isEnd) {
            currentWordIndex++;
            displayNextWord();
        } else {
            renderRomaText();
            updateKeyboardGuide();
        }
    } else {
        // ミスタイプ
        totalMissKeys++;
        currentCombo = 0; // コンボ途切れ
        comboDisplay.textContent = 0;
        
        playMissSound();
        triggerMissFeedback();
        spawnKeyFeedback(inputKey, false);
    }
    
    updateLiveStats();
});

function updateLiveStats() {
    const elapsedSeconds = (Date.now() - gameStartTime) / 1000;
    const elapsedMinutes = elapsedSeconds / 60;
    
    const wpm = elapsedMinutes > 0 ? Math.round(totalCorrectKeys / elapsedMinutes) : 0;
    wpmDisplay.textContent = wpm;
    
    const totalKeys = totalCorrectKeys + totalMissKeys;
    const accuracy = totalKeys === 0 ? 100 : Math.round((totalCorrectKeys / totalKeys) * 100);
    accuracyDisplay.textContent = `${accuracy}%`;
}

function triggerMissFeedback() {
    gameContainer.classList.add('shake-panel');
    setTimeout(() => {
        gameContainer.classList.remove('shake-panel');
    }, 250);
}

// 結果共有用のコピー
shareBtn.addEventListener('click', () => {
    const wpm = resultWpm.textContent;
    const accuracy = resultAccuracy.textContent;
    const correct = resultCorrect.textContent;
    const miss = resultMiss.textContent;
    const levelVal = playerProfile.level;
    const categoryName = categorySelect.options[categorySelect.selectedIndex].text;
    
    const shareText = 
`【NEON TYPE結果】
難易度: ${categoryName}
入力速度 (WPM): ${wpm} 文字/分
正確率: ${accuracy}
正解キー数: ${correct} 回
ミスキー数: ${miss} 回
タイピングレベル: Lv.${levelVal}
#NEON_TYPE #タイピング練習
`;

    navigator.clipboard.writeText(shareText).then(() => {
        toast.className = 'toast-hidden show';
        setTimeout(() => {
            toast.className = 'toast-hidden';
        }, 3000);
    }).catch(err => {
        console.error('コピーに失敗しました', err);
    });
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// ロード完了時にプロファイルを読み込む
window.addEventListener('DOMContentLoaded', loadProfile);
