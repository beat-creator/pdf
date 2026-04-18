/**
 * Secure Toolkit 多言語化エンジン (i18n)
 */
async function initI18n() {
    // 1. URLやブラウザから言語を判定
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || document.documentElement.lang || 'ja';
    
    // 2. ページの種類を判定（トップかツール個別ページか）
    const isTopPage = document.body.classList.contains('is-top');
    const jsonPath = isTopPage ? './assets/i18n-top.json' : './assets/i18n-tools.json';
    const toolKey = document.body.getAttribute('data-tool-key'); // 個別ページなら 'zip' 等

try {
        let data = {};

        if (isTopPage) {
            // トップページの場合は、共通項目とツール詳細の両方を読み込んで結合する
            const [resTop, resTools] = await Promise.all([
                fetch('./assets/i18n-top.json'),
                fetch('./assets/i18n-tools.json')
            ]);
            const dataTop = await resTop.json();
            const dataTools = await resTools.json();
            // toolsキーの中に詳細データを結合
            data = { ...dataTop, tools: dataTools };
        } else {
            // 個別ページの場合は従来通りツール詳細のみ
            const res = await fetch('./assets/i18n-tools.json');
            data = await res.json();
        }

        const toolKey = document.body.getAttribute('data-tool-key');

        // 3. 要素への流し込み
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const path = el.getAttribute('data-i18n').split('.');
            let value = data;

            // 個別ページ（isTopPageでない）かつ pathが 'tool.' で始まる場合の処理
            if (!isTopPage && toolKey && path[0] === 'tool') {
                value = data[toolKey];
                path.shift();
            }

            // パスを辿って値を取得
            path.forEach(key => {
                value = value ? value[key] : null;
            });

            if (value && value[lang]) {
                const text = value[lang];
                if (text.includes('\\n') || text.includes('\n')) {
                    el.style.whiteSpace = 'pre-wrap';
                    el.innerText = text.replace(/\\n/g, '\n');
                } else {
                    el.innerText = text;
                }
            }
        });

        // 4. 個別ページのSEO書き換え
        if (!isTopPage && toolKey && data[toolKey]) {
            const toolData = data[toolKey];
            document.title = toolData.seo_title[lang] || toolData.seo_title['ja'];
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', toolData.meta_desc[lang]);
        }

        // 4. SEO（Title/Meta）の動的書き換え（個別ページ用）
        if (!isTopPage && toolKey && data[toolKey]) {
            const toolData = data[toolKey];
            document.title = toolData.seo_title[lang] || toolData.seo_title['ja'];
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', toolData.meta_desc[lang]);
        }

    } catch (e) {
        console.error('i18n Error:', e);
    }
}

document.addEventListener('DOMContentLoaded', initI18n);
