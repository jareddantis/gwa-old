/**
    sw-custom.js:
      Custom logic for Service Worker.
      Currently handles caching for Google Fonts and JS libraries.

    Part of the illustra/gwa project by @jareddantis.
    Licensed under GPLv2.
*/

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
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
