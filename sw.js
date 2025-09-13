const CACHE_NAME='voley-app-v1';
const APP_SHELL=['./app_voley_pwa.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./offline.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k===CACHE_NAME?null:caches.delete(k)))) .then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(APP_SHELL.some(p=>url.pathname.endsWith(p.replace('./','/')))){
    e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(res=>{const cp=res.clone(); caches.open(CACHE_NAME).then(ch=>ch.put(e.request,cp)); return res;}).catch(()=>caches.match('./offline.html'))));
    return;
  }
  if(url.origin===location.origin){
    e.respondWith(fetch(e.request).then(res=>{const cp=res.clone(); caches.open(CACHE_NAME).then(ch=>ch.put(e.request,cp)); return res;}).catch(()=>caches.match(e.request).then(c=>c||caches.match('./offline.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(res=>{const cp=res.clone(); caches.open(CACHE_NAME).then(ch=>ch.put(e.request,cp)); return res;}).catch(()=>caches.match('./offline.html'))));
});