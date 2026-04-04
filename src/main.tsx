import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Initialize Telegram WebApp
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
  window.Telegram.WebApp.setHeaderColor('#ffffff');
  window.Telegram.WebApp.setBackgroundColor('#ffffff');
}

// Register the PWA service worker
registerSW({ immediate: true });


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
