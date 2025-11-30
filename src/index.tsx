import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ✅ تسجيل Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('✅ SW registered!');
        registration.update();
      })
      .catch(error => console.log('❌ SW failed:', error));
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);