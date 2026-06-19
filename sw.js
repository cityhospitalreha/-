// このファイルがあると、アプリの画面(HTML/CSS/JS/アイコン)が端末内に
// キャッシュ(保存)され、2回目以降の起動が速く・安定します。
// カメラ映像そのものはキャッシュされません(常にリアルタイムで取得されます)。

const CACHE_NAME = 'hyojo-mirror-v1';

// 起動に必要な最低限のファイル一覧(アプリの「外側」だけで、カメラ映像は含まない)
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png',
  './samples/01.png',
  './samples/02.png',
  './samples/03.gif'
];

// インストール時: 上記ファイルを一括でキャッシュに保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 有効化時: 古いバージョンのキャッシュを削除(アプリ更新時のため)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// リクエスト時: キャッシュにあればそれを返し、なければネットワークから取得
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
