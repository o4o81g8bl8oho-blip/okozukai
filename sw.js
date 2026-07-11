/* おこづかい帳 Service Worker */
var CACHE = 'okozukai-v4';
var FONT_CACHE = 'okozukai-fonts-v1';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './ui/card.jpg',
  './ui/avatar.jpg',
  './ui/btn.jpg',
  './ui/tile-eatout.jpg',
  './ui/tile-conbini.jpg',
  './ui/tile-hobby.jpg',
  './ui/tile-book.jpg',
  './ui/tile-fashion.jpg',
  './ui/tile-clothes.jpg',
  './ui/tile-gift.jpg',
  './ui/tile-subsc.jpg',
  './ui/tile-other.jpg',
  './ui/tag.png',
  './ui/star.png',
  './ui/cal-label.png',
  './ui/pen-label.png',
  './ui/cal-field.png',
  './ui/memo-bunny.png',
  './ui/cloud-l.png',
  './ui/cloud-r.png',
  './ui/tab-pencil.png',
  './ui/tab-bunny.png',
  './ui/tab-cloud.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(ASSETS); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        if (k !== CACHE && k !== FONT_CACHE) return caches.delete(k);
      }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);

  /* Google Fonts: キャッシュ優先＋ランタイムキャッシュ（オフラインでもフォントが出る） */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.match(e.request).then(function(hit) {
        if (hit) return hit;
        return fetch(e.request).then(function(res) {
          if (res && (res.ok || res.type === 'opaque')) {
            var copy = res.clone();
            caches.open(FONT_CACHE).then(function(c) { c.put(e.request, copy); });
          }
          return res;
        });
      })
    );
    return;
  }

  if (url.origin === location.origin) {
    /* アプリ本体（HTML）はネットワーク優先。オンラインなら常に最新を表示し、
       オフラインのときだけキャッシュにフォールバックする */
    var isDoc = e.request.mode === 'navigate'
      || url.pathname === '/'
      || url.pathname.endsWith('/')
      || url.pathname.endsWith('/index.html');
    if (isDoc) {
      e.respondWith(
        fetch(e.request).then(function(res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function(c) { c.put('./index.html', copy); });
          }
          return res;
        }).catch(function() {
          return caches.match(e.request).then(function(hit) { return hit || caches.match('./index.html'); });
        })
      );
      return;
    }
    /* 画像などその他: キャッシュ優先、なければネットワーク（取得後キャッシュ） */
    e.respondWith(
      caches.match(e.request).then(function(hit) {
        if (hit) return hit;
        return fetch(e.request).then(function(res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
          }
          return res;
        });
      })
    );
  }
});
