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
