const CACHE_NAME = 'asc-vercel-offline-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/icon.svg',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// تثبيت Service Worker وتخزين الملفات
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Service Worker: Caching app files');
        return cache.addAll(urlsToCache).catch(error => {
          console.log('⚠️ بعض الملفات ما انخزنت:', error);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('🎯 Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// اعتراض جميع الطلبات
self.addEventListener('fetch', (event) => {
  // تجاهل الطلبات غير HTTP
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // إذا الملف موجود في الكاش
        if (response) {
          console.log('✅ Serving from cache:', event.request.url);
          return response;
        }

        // إذا ما موجود، جلب من الشبكة
        console.log('🌐 Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((networkResponse) => {
            // إذا الرد ناجح، خزنه في الكاش
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  console.log('💾 Caching new resource:', event.request.url);
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.log('❌ Network failed, serving fallback');

            // إذا كان طلب صفحة، أرجع index.html
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }

            // إذا كان طلب صورة أو CSS، أرجع رسالة بديلة
            if (event.request.destination === 'image') {
              return new Response(
                '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#f0f0f0"/><text x="50" y="50" font-family="Arial" font-size="10" text-anchor="middle" fill="#666">OFFLINE</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }

            // لطلبات أخرى، أرجع رسالة نصية
            return new Response(`
              <!DOCTYPE html>
              <html>
              <head>
                <title>التطبيق يعمل بدون اتصال</title>
                <style>
                  body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 50px; 
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                  }
                  .container {
                    background: rgba(255,255,255,0.1);
                    padding: 30px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>⚡ التطبيق يعمل بدون اتصال</h1>
                  <p>أنت غير متصل بالإنترنت، ولكن التطبيق يعمل بشكل طبيعي</p>
                  <button onclick="location.reload()" style="padding: 10px 20px; margin: 10px; border: none; border-radius: 5px; background: #4CAF50; color: white; cursor: pointer;">إعادة تحميل</button>
                </div>
              </body>
              </html>
            `, {
              headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
          });
      })
  );
});

// استقبال رسائل من الصفحة الرئيسية
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
