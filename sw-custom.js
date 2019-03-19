/**
    @file sw-custom.js
    @description Custom logic for the service worker.
                 Handles Google Font and JS lib caching.
    @author Jared Dantis (@jareddantis)
    @license GPLv2
*/

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
// https://developers.google.com/web/tools/workbox/guides/common-recipes
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
// https://developers.google.com/web/tools/workbox/guides/common-recipes
workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);

// Cache files from CDNJS and JSDelivr
workbox.routing.registerRoute(
    /^https:\/\/(?:cdnjs|cdn)\.(?:cloudflare|jsdelivr)\.(?:com|net)/,
    new workbox.strategies.CacheFirst({
        cacheName: 'cdn-resources',
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);
