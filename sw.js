const CACHE_STATIC = 'app-shell-v1';
const CACHE_DYNAMIC = 'app-dynamic-v1';

const ASSETS_APP_SHELL = [
  '/M-anifest/',
  '/M-anifest/index.html',
  '/M-anifest/main.js',
  '/M-anifest/styles.css',
  '/M-anifest/calendario.html',
  '/M-anifest/sw.js',
  '/M-anifest/formulario.html',
  '/M-anifest/192.png',
  '/M-anifest/512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      console.log('Precaching App Shell...');
      return cache.addAll(ASSETS_APP_SHELL);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_STATIC && k !== CACHE_DYNAMIC)
            .map(k => caches.delete(k))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResp => {
      if (cachedResp) return cachedResp;

      return fetch(event.request)
        .then(networkResp => {
          return caches.open(CACHE_DYNAMIC).then(cache => {
            if (event.request.url.startsWith('http')) {
              cache.put(event.request, networkResp.clone());
            }
            return networkResp;
          });
        })
        .catch(() => caches.match('/M-anifest/index.html'));
    })
  );
});
