// 앱 파일과 Firebase SDK만 캐시: 온라인이면 최신 파일, 오프라인이면 캐시로 실행
// (Firestore 실시간 통신은 건드리지 않음 — 오프라인 데이터는 Firestore 자체 캐시가 담당)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || (url.origin !== location.origin && url.hostname !== 'www.gstatic.com')) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const c = r.clone(); caches.open('app').then(cache => cache.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
