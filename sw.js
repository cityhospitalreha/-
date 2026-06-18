// このファイルがあると、アプリの画面(HTML/CSS/JS/アイコン)が端末内に
// キャッシュ(保存)され、2回目以降の起動が速く・安定します。
// カメラ映像そのものはキャッシュされません(常にリアルタイムで取得されます)。

const CACHE_NAME = 'hyojo-mirror-v2';

// 起動に必要な最低限のファイル一覧(アプリの「外側」だけで、カメラ映像は含まない)
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png',
  './samples/03.gif',
  './samples/04.gif',
  './samples/05.gif',
  './samples/06.gif',
  './samples/07.gif',
  './samples/08.gif',
  './samples/09.gif',
  './samples/10.gif'
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

// リクエスト時: まずネットワークから最新版を取りに行く。
// (オフラインなどで取得できない場合のみ、キャッシュを使う)
// → こうしておくと、サンプル画像を更新した際に古い表示のままになる心配がない。
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
