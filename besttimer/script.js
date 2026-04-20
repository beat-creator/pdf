// 設定値の初期化
let settings = {
    sets: 8,
    activeTime: 20, // 秒
    restTime: 10,   // 秒
    skipLastRest: true
};

// 合計時間を計算して表示を更新する関数
function updateTotalTime() {
    // 全体の秒数を計算
    // (トレーニング + 休息) × セット数 - (最後の休息を引くか判定)
    let totalSeconds = (settings.activeTime + settings.restTime) * settings.sets;
    
    if (settings.skipLastRest) {
        totalSeconds -= settings.restTime;
    }

    // 分:秒 の形式に変換
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    // 表示を更新 (00:00 形式)
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.querySelector('.total-time').textContent = timeString;
}

// 試しにセット数を変えてみる（テスト用）
// settings.sets = 10;
// updateTotalTime();

let pressTimer; // 長押し用のタイマー
let pressInterval = 200; // 初期の更新間隔 (ms)

/**
 * 数字を更新するメインロジック
 * @param {string} type - 'sets' | 'activeTime' | 'restTime'
 * @param {number} delta - +1 または -1
 */
function changeValue(type, delta) {
    if (type === 'sets') {
        settings.sets = Math.max(1, settings.sets + delta);
        // HTMLの表示を更新（クラス名は適宜調整してください）
        document.querySelectorAll('.value')[0].textContent = settings.sets;
    } else if (type === 'activeTime') {
        settings.activeTime = Math.max(0, settings.activeTime + delta);
        renderTimeValue(1, settings.activeTime);
    } else if (type === 'restTime') {
        settings.restTime = Math.max(0, settings.restTime + delta);
        renderTimeValue(2, settings.restTime);
    }
    updateTotalTime(); // 合計時間の再計算
}

// 00:00形式で表示を更新するヘルパー
function renderTimeValue(index, seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    document.querySelectorAll('.value')[index].textContent = `${m}:${s}`;
}

/**
 * 長押し加速のコア関数
 */
function startPress(type, delta) {
    // 1回目のクリック
    changeValue(type, delta);

    // 長押し処理の開始
    let counter = 0;
    pressInterval = 200; // インターバルをリセット

    const loop = () => {
        changeValue(type, delta);
        counter++;

        // 5回更新ごとに速度を上げる（加速ロジック）
        if (counter > 5 && pressInterval > 50) {
            pressInterval -= 30;
        }

        pressTimer = setTimeout(loop, pressInterval);
    };

    // 最初に少し待ってから連打モードへ移行
    pressTimer = setTimeout(loop, 500);
}

function stopPress() {
    clearTimeout(pressTimer);
}

// --- イベントリスナーの登録 ---
// 例：セット数の「＋」ボタン
const plusBtn = document.querySelector('.btn-plus');

// マウス・タッチ両対応
plusBtn.addEventListener('mousedown', () => startPress('sets', 1));
plusBtn.addEventListener('mouseup', stopPress);
plusBtn.addEventListener('mouseleave', stopPress); // 画面外に指が逃げた時用

plusBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // スマホのズーム等を防止
    startPress('sets', 1);
});
plusBtn.addEventListener('touchend', stopPress);

