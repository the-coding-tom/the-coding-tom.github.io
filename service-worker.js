importScripts("/precache-manifest.060c2455ecc9b2970aa71f6e09561ae9.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

// service-worker.js

workbox.core.setCacheNameDetails({ prefix: 'd4' })
    //Change this value every time before you build
const LATEST_VERSION = 'v0.5'
self.addEventListener('activate', (event) => {
    // console.log(`%c ${LATEST_VERSION} `, 'background: #ddd; color: #e8e8e8')
    if (caches) {
        caches.keys().then((arr) => {
            arr.forEach((key) => {
                if (key.indexOf('d4-precache') < -1) {
                    caches.delete(key).then(() => console.log(`%c Cleared ${key}`, 'background: #333; color: #ff0000'))
                } else {
                    caches.open(key).then((cache) => {
                        cache.match('version').then((res) => {
                            if (!res) {
                                cache.put('version', new Response(LATEST_VERSION, { status: 200, statusText: LATEST_VERSION }))
                            } else if (res.statusText !== LATEST_VERSION) {
                                caches.delete(key).then(() => console.log(`%c Cleared Cache ${LATEST_VERSION}`, 'background: #333; color: #ff0000'))
                            } else console.log(`%c Great you have the latest version ${LATEST_VERSION}`, 'background: #333; color: #00ff00')
                        })
                    })
                }
            })
        })
    }
})

workbox.skipWaiting()
workbox.clientsClaim()

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.suppressWarnings()
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})


//install new service worker when ok, then reload page
self.addEventListener("message", msg => {
    if(msg.data.action == 'skipWaiting'){
        self.skipWaiting()
    }
})

self.addEventListener('notificationclick', event => {
    let targetUrl = new URL('/');
    event.waitUntil(async function() {
      const allClients = await clients.matchAll({
        includeUncontrolled: true,
        type: 'window'
      });
  
      let requestClient;
  
      // Let's see if we already have a request window open:
      for (const client of allClients) {
        const url = new URL(client.url);
  
        if (url.host === targetUrl.host && 'focus' in client) {
          // Excellent, let's use it!
        //   Update URL
          client.navigate('/');
        //   Focus existing window
          client.focus()
          requestClient = client;
          break;
        }
      }
  
      // If we didn't find an existing request window,
      // open a new one:
      if (!requestClient) {
        requestClient = await clients.openWindow('/');
      }
  
      // Message the client:
      requestClient.postMessage("Your request status updated!");
    }());
  });


self.addEventListener('push', function(event) {
    // console.log('[Service Worker] Push Received.');
    // console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
    const eventInfo = event.data.text();
    const data = JSON.parse(eventInfo);
    const title = data.head || 'New Notification 🕺🕺';
    const body = data.body || 'This is default content. Your notification didn\'t have one 🙄🙄';
    const options = {
        body: body,
        icon: '<%= BASE_URL %>favicon.ico',
        vibrate: [200, 100, 200, 100, 200, 100, 400],
        badge: '<%= BASE_URL %>favicon.ico'
    };
    // console.log(eventInfo)
  
    const notificationPromise = self.registration.showNotification(title, options);
event.waitUntil(notificationPromise);
  });


