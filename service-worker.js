const CACHE_NAME = 'embrune-cache-v1';
const OLD_CACHE_NAME = 'embervale-cache-v1';
const DYNAMICALLY_CACHED_HOSTS = [
    'api.iconify.design',
    'aistudiocdn.com',
    'picsum.photos',
    'cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching core assets');
            // Pre-cache the main app shell files. Other assets will be cached on the fly.
            return cache.addAll([
                '/',
                '/index.html',
                'https://cdn.tailwindcss.com'
            ]);
        }).then(() => self.skipWaiting()) // Activate worker immediately
    );
});

self.addEventListener('activate', (event) => {
    // Add the old cache name to the whitelist to prevent it from being deleted.
    // This ensures returning players don't lose their cached assets.
    const cacheWhitelist = [CACHE_NAME, OLD_CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control of all open pages
    );
});

self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // Only handle GET requests.
    if (event.request.method !== 'GET') {
        return;
    }

    // Use a cache-first strategy for all assets we want to make available offline.
    // caches.match() will search across ALL caches, so it will find assets in the old cache if they exist.
    if (event.request.url.startsWith(self.location.origin) || DYNAMICALLY_CACHED_HOSTS.some(host => requestUrl.hostname.includes(host))) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                // If we have a cached response, return it.
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise, fetch from the network.
                return fetch(event.request).then((networkResponse) => {
                    // If the fetch is successful, cache the response for future offline use in the NEW cache.
                    if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    console.warn(`Fetch failed for: ${event.request.url}`);
                    // Optional: Return a fallback offline page or image here if needed.
                });
            })
        );
    }
});