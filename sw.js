/**
    Logic for the GWA app ServiceWorker.
    Based on Ole Michelsen's "Making an offline web app
    with Service Workers."

    @file sw.js
    @author Jared Dantis (@aureljared)
    @license GPLv2
*/

// Must match state.current.version*
var CACHE_VERSION = "pisaygwa-web-r14-v12.4.3";

// Install: Cache app files
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function(cache) {
            return cache.addAll([
                './index.html',
                './dist/css/style.css',
                './dist/img/android.svg',
                './dist/img/comment.svg',
                './dist/img/cross.svg',
                './dist/img/dropdown.svg',
                './dist/img/edit.svg',
                './dist/img/menu.svg',
                './dist/img/minus.svg',
                './dist/img/name.svg',
                './dist/img/plus.svg',
                './dist/img/swap.svg',
                './dist/img/theme.svg',
                './dist/img/trash.svg',
                './dist/js/fastclick.min.js',
                './dist/js/jquery.min.js',
                './dist/js/script.js',
                './dist/js/touchswipe.min.js',
                './dist/js/webfontloader.min.js'
            ]).catch(function(error) {
                console.error("[sw] Error on install: " + error);
            }).then(function() {
                console.log("[sw] Installed");
            });
        })
    );
});

// Activate: Do some housekeeping
self.addEventListener('activate', function(event){
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    // Delete old cached app files
                    if (cacheName !== CACHE_VERSION) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            console.log("[sw] Activated");
        })
    );
});

// Fetch: Serve files from cache if possible,
//        fetch from network if not in cache
self.addEventListener('fetch', function(event) {
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request).then(function(cached) {
                // Request is not in cache, fetch remotely and save locally
                var fetched = fetch(event.request).then(function(response) {
                    return caches.open(CACHE_VERSION).then(function(cache) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                }).catch(function(error) {
                    console.error("[sw] Error while fetching " + event.request.url + ": " + error);
                });

                // Prefer serving from cache
                return cached || fetched;
            }).catch(function(error) {
                console.error("[sw] Error handling fetch: " + error);
            })
        );
    }
});
