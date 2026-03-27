import ReactDOM from 'react-dom';
import React from 'react';

export const loadRemoteModule = async (url: string, scope: string, moduleName: string) => {
    console.log('#52 x 1 Starting loadRemoteModule', { url, scope, moduleName });
    let result = null;

    try {
        // 1. Инициализация share scopes
        // @ts-ignore
        if (typeof window !== 'undefined' && !window.__webpack_share_scopes__) {
            console.log('#52 x 2 Initializing share scopes');
            // @ts-ignore
            window.__webpack_share_scopes__ = {
                default: {
                    react: { '18.2.0': { get: () => Promise.resolve(() => React), loaded: true, from: 'host' } },
                    'react-dom': { '18.2.0': { get: () => Promise.resolve(() => ReactDOM), loaded: true, from: 'host' } },
                },
            };
        }

        // 2. Валидация URL
        let baseUrl = '';
        try {
            const remoteEntryUrl = new URL(url);
            baseUrl = remoteEntryUrl.origin + remoteEntryUrl.pathname.replace(/\/[^/]*$/, '/');
            console.log('#52 x 3 Base URL resolved:', baseUrl);
        } catch (e) {
            console.log('#52 x 3.1 Invalid URL', url);
            return null;
        }

        // 3. Загрузка кода
        console.log('#52 x 4 Fetching:', url);
        let response = null;
        try {
            response = await fetch(url, { mode: 'cors' });
        } catch (err) {
            console.log('#52 x 4.1 Fetch failed (suppressed):', String(err));
            return null;
        }

        if (!response || !response.ok) {
            console.log('#52 x 5 Response not ok', response?.status);
            return null;
        }

        let code = await response.text();
        console.log('#52 x 6 Code loaded, length:', code.length);

        if (code.trim().startsWith('<')) {
            console.error('#52 x 6.1 Error: Received HTML instead of JavaScript. Check your URL.');
            return null;
        }

        // 4. Патчинг __federation_import
        const patchCode = `async function __federation_import(name) {
          let fullUrl = name;
          try {
            if (name.startsWith('./') || name.startsWith('../') || name.startsWith('/')) {
              fullUrl = new URL(name, '${baseUrl}').href;
            } else if (!name.startsWith('http') && !name.startsWith('//')) {
              fullUrl = new URL(name, '${baseUrl}').href;
            }
          } catch(e) {}
          name = fullUrl;
          console.log('[Module Federation] Resolved:', name);`;

        const newCode = code.replace(/async\s+function\s+__federation_import\s*\(\s*name\s*\)\s*\{/, patchCode);

        if (newCode === code) {
            console.log('#52 x 7 Patching failed: function signature not found');
        } else {
            console.log('#52 x 7 Patching successful');
            code = newCode;
        }

        // 5. Импорт модуля через Blob
        const blob = new Blob([code], { type: 'application/javascript' });
        const blobUrl = URL.createObjectURL(blob);
        console.log('#52 x 8 Blob URL created');

        try {
            // @ts-ignore
            const container = await import(/* webpackIgnore: true */ blobUrl);
            console.log('#52 x 9 Container imported');

            // @ts-ignore
            await container.init(window.__webpack_share_scopes__.default);
            console.log('#52 x 10 Container initialized');

            const factory = await container.get(moduleName);
            const Module = factory();
            console.log('#52 x 11 Module factory called');
            result = Module;
        } catch (error) {
            console.log('#52 x 11.1 Error during import or init:', String(error));
        } finally {
            URL.revokeObjectURL(blobUrl);
        }

    } catch (error) {
        console.log('#52 x 12 Critical error in loadRemoteModule:', String(error));
    }

    console.log('#52 x 13 Returning result:', !!result);
    return result;
};
