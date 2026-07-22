const CACHE_NAME = 'keuangan-app-cache-v1';
const urlsToCache = [
  './index.html',
  './manifest.json'
  // Perhatikan: script dari CDN (seperti Tailwind/Tesseract) umumnya dikelola oleh HTTP cache 
  // Jika ingin offline penuh, Anda bisa menambahkannya kemari, tapi ukuran tesseract.js cukup besar.
];

// Instalasi Service Worker (Caching asset statis)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Strategi Pengambilan data jaringan (Network-First)
// Digunakan karena aplikasi butuh post dan beroperasi optimal secara online
self.addEventListener('fetch', event => {
  // Biarkan request POST lewat saja, tak perlu dicache
  if (event.request.method === 'POST') {
      return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Menghapus cache lama jika update versi
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
