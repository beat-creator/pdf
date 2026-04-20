document.addEventListener('DOMContentLoaded', () => {
    // 1. 設定値の初期化
    let settings = {
        sets: 8,
        activeTime: 20,
        restTime: 10,
        skipLastRest: true
    };

    let pressTimer;
    let pressInterval = 200;

    // 2. 合計時間の計算と反映
    function updateTotalTime() {
        let totalSeconds = (settings.activeTime + settings.restTime) * settings.sets;
        if (settings.skipLastRest) totalSeconds -= settings.restTime;

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        document.querySelector('.total-time').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // 3. 値の更新とHTML反映
    function changeValue(type, delta) {
        if (type === 'sets') {
            settings.sets = Math.max(1, settings.sets + delta);
            document.querySelectorAll('.value')[0].textContent = settings.sets;
        } else if (type === 'activeTime') {
            settings.activeTime = Math.max(0, settings.activeTime + delta);
            renderTimeValue(1, settings.activeTime);
        } else if (type === 'restTime') {
            settings.restTime = Math.max(0, settings.restTime + delta);
            renderTimeValue(2, settings.restTime);
        }
        updateTotalTime();
    }

    function renderTimeValue(index, seconds) {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        document.querySelectorAll('.value')[index].textContent = `${m}:${s}`;
    }

    // 4. 長押しロジック
    function startPress(type, delta) {
        stopPress(); // 二重起動防止
        changeValue(type, delta);
        let counter = 0;
        pressInterval = 200;

        const loop = () => {
            changeValue(type, delta);
            counter++;
            if (counter > 5 && pressInterval > 50) pressInterval -= 30;
            pressTimer = setTimeout(loop, pressInterval);
        };
        pressTimer = setTimeout(loop, 500);
    }

    function stopPress() {
        clearTimeout(pressTimer);
    }

    // 5. 全てのボタンにイベントを登録
    const configRows = document.querySelectorAll('.card');
    const types = ['sets', 'activeTime', 'restTime'];

    configRows.forEach((row, index) => {
        const type = types[index];
        const minusBtn = row.querySelector('.btn-minus');
        const plusBtn = row.querySelector('.btn-plus');

        // プラスボタンの設定
        [plusBtn, minusBtn].forEach(btn => {
            const delta = btn.classList.contains('btn-plus') ? 1 : -1;

            btn.addEventListener('mousedown', () => startPress(type, delta));
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                startPress(type, delta);
            });
        });
    });

    // 離した時の処理を全体に登録
    window.addEventListener('mouseup', stopPress);
    window.addEventListener('touchend', stopPress);

    // 初期表示
    updateTotalTime();
});
