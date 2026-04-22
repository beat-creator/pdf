/**
 * Secure Toolkit i18n Engine - Final Version
 */
async function initI18n() {
    // 1. 言語判定 (URL優先 > ブラウザ設定 > デフォルト日本語)
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || (navigator.language || 'ja').split('-')[0];
    const isTopPage = document.body.classList.contains('is-top');
    
    try {
        let combinedData = {};

        if (isTopPage) {
            // トップページ：2つのJSONを並列読み込みして統合
            const [resTop, resTools] = await Promise.all([
                fetch('./assets/i18n-top.json'),
                fetch('./assets/i18n-tools.json')
            ]);
            const dataTop = await resTop.json();
            const dataTools = await resTools.json();
            
            // 統合構造の作成
            combinedData = { 
                top: dataTop.top, 
                tools: dataTools 
            };
        } else {
            // 個別ページ：ツール用JSONのみ
            const res = await fetch('./assets/i18n-tools.json');
            combinedData = await res.json();
        }

        const toolKey = document.body.getAttribute('data-tool-key');

        // 2. 要素への流し込み
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const pathKey = el.getAttribute('data-i18n');
            const path = pathKey.split('.');
            let target = combinedData;

            // 個別ページ用のショートカット
            if (!isTopPage && toolKey && path[0] === 'tool') {
                target = combinedData[toolKey];
                path.shift();
            }

            // パスを動的に辿る (配列インデックスにも対応)
            for (const segment of path) {
                if (target && target[segment] !== undefined) {
                    target = target[segment];
                } else {
                    target = null;
                    break;
                }
            }

            // 言語の適用
            if (target && (target[lang] || target['ja'])) {
                const text = target[lang] || target['ja'];
                const formattedText = text.replace(/\\n/g, '\n');
                
                // inputやtextareaの場合はvalue、それ以外はinnerText
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.value = formattedText;
                } else {
                    el.innerText = formattedText;
                }
            }
        });

        // 3. SEO設定 (個別ページのみ)
        if (!isTopPage && toolKey && combinedData[toolKey]) {
            const tool = combinedData[toolKey];
            document.title = tool.seo_title[lang] || tool.seo_title['ja'];
            const meta = document.querySelector('meta[name="description"]');
            if (meta) meta.setAttribute('content', tool.meta_desc[lang] || tool.meta_desc['ja']);
        }

    } catch (e) {
        console.error('i18n Engine Error:', e);
    }
}

document.addEventListener('DOMContentLoaded', initI18<section class="ai-log-section">
    </section>


</script>n);
