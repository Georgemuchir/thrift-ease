/**
 * QuickThrift Service Worker
 * Provides offline functionality and caching for PWA experience
 */

const CACHE_NAME = 'quickthrift-v1.0.1';
const STATIC_CACHE_NAME = 'quickthrift-static-v1.0.1';
const DYNAMIC_CACHE_NAME = 'quickthrift-dynamic-v1.0.1';

const staticAssets = [
  '/',
  '/index.html',
  '/sign-in-new.html',
  '/sign-up-new.html',
  '/css/guza-style.css',
  '/quickthrift-functional.js',
  '/auth-new.js',
  '/demo1.jpeg',
  '/demo2.jpeg',
  '/demo3.jpeg',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install Service Worker
self.addEventListener('install', event => {
  console.log('QuickThrift SW: Installing Service Worker v1.0.1');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('QuickThrift SW: Caching static files');
        return cache.addAll(staticAssets);
      })
      .then(() => {
        console.log('QuickThrift SW: Static files cached successfully');
        return self.skipWaiting(); // Force activation
      })
      .catch(error => {
        console.error('QuickThrift SW: Failed to cache static files', error);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  console.log('QuickThrift SW: Activating Service Worker v1.0.1');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('QuickThrift SW: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim()
    ])
  );
});

// Fetch Strategy: Cache First with Network Fallback
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (event.request.destination === 'document') {
    // Handle navigation requests
    event.respondWith(handleNavigationRequest(event.request));
  } else if (event.request.destination === 'image') {
    // Handle image requests
    event.respondWith(handleImageRequest(event.request));
  } else {
    // Handle other static assets
    event.respondWith(handleStaticAssetRequest(event.request));
  }
});

// Handle navigation requests (HTML pages)
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Ultimate fallback to index.html for SPA routing
    const indexResponse = await caches.match('/index.html');
    if (indexResponse) {
      return indexResponse;
    }
    
    // Return offline page if available
    return new Response('Offline - Please check your connection', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Handle image requests
async function handleImageRequest(request) {
  try {
    // Check cache first for images
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return placeholder image if available
    return new Response('Image not available offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Handle static asset requests (CSS, JS, etc.)
async function handleStaticAssetRequest(request) {
  try {
    // Check cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('QuickThrift SW: Failed to fetch static asset', request.url, error);
    return new Response('Asset not available offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Background Sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'quickthrift-sync') {
    console.log('QuickThrift SW: Background sync triggered');
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data function
async function syncOfflineData() {
  try {
    console.log('QuickThrift SW: Syncing offline data...');
    // Future implementation for syncing offline form submissions, etc.
    return Promise.resolve();
  } catch (error) {
    console.error('QuickThrift SW: Failed to sync offline data', error);
    throw error;
  }
}

// Message handling for communication with main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
