// ✅ هذا الملف سيصلح كل مشاكل PWA تلقائياً
// اجعله يعمل قبل البناء

const fs = require('fs');
const path = require('path');

// 1. إنشاء manifest.json كامل
const manifest = {
  "name": "Abo Suhail Calculator - Premium Offline Edition",
  "short_name": "ASC Calc",
  "description": "آلة حاسبة متقدمة وذكية تعمل بدون إنترنت مع حسابات ضريبية دقيقة وتصحيح ذكي للأخطاء",
  "id": "asc-calculator-v2",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "display_override": ["standalone", "window-controls-overlay"],
  "orientation": "portrait",
  "theme_color": "#050A14",
  "background_color": "#050A14",
  "lang": "ar",
  "dir": "rtl",
  "categories": ["calculator", "productivity", "finance", "utilities"],
  "icons": [
    {
      "src": "/assets/icon-72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/assets/icon-96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/assets/icon-128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/assets/icon-144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/assets/icon-152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/assets/icon-384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/assets/screenshot-mobile-1.png",
      "sizes": "1080x1920",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "الحاسبة الرئيسية"
    },
    {
      "src": "/assets/screenshot-mobile-2.png",
      "sizes": "1080x1920",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "إعدادات الضريبة"
    },
    {
      "src": "/assets/screenshot-desktop.png",
      "sizes": "1920x1080",
      "type": "image/png",
      "form_factor": "wide",
      "label": "واجهة سطح المكتب"
    }
  ],
  "shortcuts": [
    {
      "name": "حاسبة الضريبة",
      "short_name": "ضريبة",
      "description": "فتح الحاسبة مع حاسبة الضريبة",
      "url": "/?shortcut=tax-calculator",
      "icons": [
        {
          "src": "/assets/shortcut-tax.png",
          "sizes": "96x96",
          "purpose": "any"
        }
      ]
    },
    {
      "name": "سجل الحسابات",
      "short_name": "السجل",
      "description": "عرض سجل الحسابات السابقة",
      "url": "/?shortcut=history",
      "icons": [
        {
          "src": "/assets/shortcut-history.png",
          "sizes": "96x96",
          "purpose": "any"
        }
      ]
    },
    {
      "name": "إعدادات التطبيق",
      "short_name": "إعدادات",
      "description": "فتح إعدادات التطبيق والتخصيص",
      "url": "/?shortcut=settings",
      "icons": [
        {
          "src": "/assets/shortcut-settings.png",
          "sizes": "96x96",
          "purpose": "any"
        }
      ]
    }
  ],
  "protocol_handlers": [
    {
      "protocol": "web+calculator",
      "url": "/?calc=%s"
    },
    {
      "protocol": "web+asc-calc",
      "url": "/?protocol=%s"
    }
  ],
  "share_target": {
    "action": "/share",
    "method": "GET",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  },
  "edge_side_panel": {
    "preferred_width": 400
  },
  "launch_handler": {
    "client_mode": "navigate-existing"
  },
  "prefer_related_applications": false
};

fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
console.log('✅ Manifest كامل تم إنشاؤه!');

// 2. تعديل vite.config.ts تلقائياً
const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/**/*', 'offline.html'],
      manifest: false, // ✅ نستخدم manifest.json اليدوي
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\\/\\/fonts\\.googleapis\\.com\\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', cacheableResponse: { statuses: [0, 200] } }
          },
          {
            urlPattern: /^https:\\/\\/cdn\\.tailwindcss\\.com\\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'tailwind-cdn', cacheableResponse: { statuses: [0, 200] } }
          }
        ],
        navigateFallback: '/index.html',
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ],
});`;

fs.writeFileSync('vite.config.ts', viteConfig);
console.log('✅ vite.config.ts تم تعديله!');

// 3. تعديل index.html لإضافة Meta Tags
const htmlContent = fs.readFileSync('index.html', 'utf8');
const metaTags = `
  <meta name="application-name" content="ASC Calc">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Abo Suhail Calculator">
  <meta name="description" content="آلة حاسبة متقدمة وذكية تعمل بدون إنترنت مع حسابات ضريبية دقيقة">
  <meta name="keywords" content="calculator, tax, offline, pwa, arabic, productivity">
  <meta name="author" content="Abo Suhail">
  <link rel="apple-touch-icon" href="/assets/icon-192.png">
  <link rel="canonical" href="https://a-s-c-final.vercel.app/">
`;

const updatedHtml = htmlContent.replace('</title>', '</title>' + metaTags);
fs.writeFileSync('index.html', updatedHtml);
console.log('✅ index.html تم تعديله!');

console.log('\n🎉 كل شيء جاهز! شغّل هذه الأمر:');
console.log('npm run build && echo "✅ انتهى!"');
