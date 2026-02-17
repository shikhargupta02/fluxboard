import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

// Workbox InjectManifest injects __WB_MANIFEST at build time
precacheAndRoute(self.__WB_MANIFEST);

// Cache-first for all navigation requests
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new CacheFirst({ cacheName: 'fluxboard-pages' })
);

self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('install', () => self.skipWaiting());
