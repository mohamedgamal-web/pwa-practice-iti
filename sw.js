/**
 * Service Worker for PWA
 * This file handles caching, offline functionality, and background sync
 * Service workers run in the background and act as a proxy between your app and the network
 */

// Define cache name and version - increment version to force cache update
const CACHE_NAME = 'pwa-practice-v1.2';

// Define files to cache - these will be available offline
const STATIC_CACHE_FILES = [
    '/',                          // Root path
    '/index.html',               // Main page
    '/other.html',               // Other page
    '/below/another.html',       // Another page in subdirectory
    '/styles/index.css',         // Main page styles
    '/styles/other.css',         // Other page styles
    '/styles/another.css',       // Another page styles
    '/js/main.js',              // Main page JavaScript
    '/js/other.js',             // Other page JavaScript
    '/js/another.js',           // Another page JavaScript
    '/manifest/manifest.json',   // Web app manifest
    '/manifest/gold-star-192.png', // App icon
    '/manifest/gold-star-512.png'  // App icon (larger)
];

/**
 * Install Event
 * Fired when the service worker is first installed
 * This is where we set up the initial cache
 */
self.addEventListener('install', function(event) {
    console.log('Service Worker: Installing...');
    
    // Skip waiting to activate immediately (for development)
    // In production, you might want to remove this to avoid breaking running apps
    self.skipWaiting();
    
    // Cache all static files during installation
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_CACHE_FILES);
            })
            .then(function() {
                console.log('Service Worker: All static files cached successfully');
            })
            .catch(function(error) {
                console.error('Service Worker: Failed to cache static files', error);
            })
    );
});

/**
 * Activate Event
 * Fired when the service worker becomes active
 * This is where we clean up old caches
 */
self.addEventListener('activate', function(event) {
    console.log('Service Worker: Activating...');
    
    // Take control of all pages immediately
    event.waitUntil(
        // Clean up old caches
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    // Delete old cache versions
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            console.log('Service Worker: Activated and ready');
            // Take control of all pages
            return self.clients.claim();
        })
    );
});

/**
 * Fetch Event
 * Fired whenever the app makes a network request
 * This is where we implement our caching strategy
 */
self.addEventListener('fetch', function(event) {
    const requestUrl = event.request.url;
    console.log('Service Worker: Fetching', requestUrl);
    
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Implement Cache First strategy for our app files
    event.respondWith(
        caches.match(event.request)
            .then(function(cachedResponse) {
                // If we have a cached version, return it
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache:', requestUrl);
                    return cachedResponse;
                }
                
                // If not in cache, fetch from network
                console.log('Service Worker: Fetching from network:', requestUrl);
                return fetch(event.request)
                    .then(function(networkResponse) {
                        // Check if we received a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // Clone the response (responses can only be consumed once)
                        const responseToCache = networkResponse.clone();
                        
                        // Add successful network responses to cache for future use
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                // Only cache same-origin requests
                                if (event.request.url.startsWith(self.location.origin)) {
                                    console.log('Service Worker: Caching new resource:', requestUrl);
                                    cache.put(event.request, responseToCache);
                                }
                            });
                        
                        return networkResponse;
                    })
                    .catch(function(error) {
                        console.log('Service Worker: Network fetch failed:', error);
                        
                        // If it's a navigation request and we're offline, serve a fallback page
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        
                        // For other requests, you could return a default offline response
                        throw error;
                    });
            })
    );
});

/**
 * Message Event
 * Handle messages from the main application
 * This allows communication between the service worker and the app
 */
self.addEventListener('message', function(event) {
    console.log('Service Worker: Received message:', event.data);
    
    // Handle different message types
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                // Force the service worker to activate immediately
                self.skipWaiting();
                break;
                
            case 'GET_CACHE_INFO':
                // Send cache information back to the app
                getCacheInfo().then(function(info) {
                    event.ports[0].postMessage({
                        type: 'CACHE_INFO',
                        data: info
                    });
                });
                break;
                
            case 'CLEAR_CACHE':
                // Clear all caches
                clearAllCaches().then(function() {
                    event.ports[0].postMessage({
                        type: 'CACHE_CLEARED'
                    });
                });
                break;
        }
    }
});

/**
 * Background Sync Event
 * Handle background synchronization when the user comes back online
 * This is useful for queuing actions while offline
 */
self.addEventListener('sync', function(event) {
    console.log('Service Worker: Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Perform background sync operations
            performBackgroundSync()
        );
    }
});

/**
 * Push Event
 * Handle push notifications
 * This allows the app to receive notifications even when not open
 */
self.addEventListener('push', function(event) {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New notification from PWA Practice',
        icon: '/manifest/gold-star-192.png',
        badge: '/manifest/gold-star-192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore',
                icon: '/manifest/gold-star-192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/manifest/gold-star-192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('PWA Practice', options)
    );
});

/**
 * Notification Click Event
 * Handle clicks on push notifications
 */
self.addEventListener('notificationclick', function(event) {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        // Open the app when notification is clicked
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

/**
 * Utility Functions
 */

/**
 * Get information about cached files
 * @returns {Promise} Promise that resolves with cache information
 */
function getCacheInfo() {
    return caches.keys().then(function(cacheNames) {
        return Promise.all(
            cacheNames.map(function(cacheName) {
                return caches.open(cacheName).then(function(cache) {
                    return cache.keys().then(function(requests) {
                        return {
                            name: cacheName,
                            files: requests.map(function(request) {
                                return request.url;
                            })
                        };
                    });
                });
            })
        );
    });
}

/**
 * Clear all caches
 * @returns {Promise} Promise that resolves when all caches are cleared
 */
function clearAllCaches() {
    return caches.keys().then(function(cacheNames) {
        return Promise.all(
            cacheNames.map(function(cacheName) {
                console.log('Service Worker: Deleting cache:', cacheName);
                return caches.delete(cacheName);
            })
        );
    });
}

/**
 * Perform background synchronization
 * This function runs when the user comes back online
 * @returns {Promise} Promise that resolves when sync is complete
 */
function performBackgroundSync() {
    console.log('Service Worker: Performing background sync');
    
    // Here you would typically:
    // 1. Send queued data to the server
    // 2. Update cached content
    // 3. Sync user preferences
    
    return Promise.resolve();
}

/**
 * Error Event
 * Handle any errors that occur in the service worker
 */
self.addEventListener('error', function(event) {
    console.error('Service Worker: Error occurred:', event.error);
});

/**
 * Unhandled Rejection Event
 * Handle unhandled promise rejections
 */
self.addEventListener('unhandledrejection', function(event) {
    console.error('Service Worker: Unhandled promise rejection:', event.reason);
});

// Log when service worker script is loaded
console.log('Service Worker: Script loaded and ready');