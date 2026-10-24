/* 健康打卡 Service Worker：网络优先，断网时用缓存壳 */
const C='hc-shell-v8';
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./manifest.webmanifest'])));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>
    Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.pathname.startsWith('/api/')||e.request.method!=='GET') return;
  e.respondWith(fetch(e.request).then(resp=>{
    const cp=resp.clone(); caches.open(C).then(c=>c.put(e.request,cp)); return resp;
  }).catch(()=>caches.match(e.request)));
});
