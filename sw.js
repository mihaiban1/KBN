// Service Worker for KBN Financial Boutique Website
// Implements caching strategies for improved performance

const CACHE_NAME = 'kbn-financial-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/who-we-are.html',
    '/loan.html',
    '/contact.html',
    '/login.html',
    '/resources.html',
    '/blog/index.html',
    '/dashboard/member.html',
    '/dashboard/admin.html',
    '/assets/css/base.css',
    '/assets/css/layout.css',
    '/assets/css/components.css',
    '/assets/css/utils.css',
    '/assets/js/main.js',
    '/assets/js/form-wizard.js',
    '/assets/js/enhanced-features.js',
    '/assets/img/kbn-logo.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(event.request).then((response) => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Handle offline form submissions
    const offlineSubmissions = await getOfflineSubmissions();
    
    for (const submission of offlineSubmissions) {
        try {
            await fetch(submission.url, {
                method: submission.method,
                headers: submission.headers,
                body: submission.body
            });
            
            // Remove successful submission from offline storage
            removeOfflineSubmission(submission.id);
        } catch (error) {
            console.log('Background sync failed for:', submission.id);
        }
    }
}

async function getOfflineSubmissions() {
    // This would typically read from IndexedDB
    return [];
}

function removeOfflineSubmission(id) {
    // This would typically remove from IndexedDB
    console.log('Removing offline submission:', id);
}

// Push notification handling
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update from KBN Financial Boutique',
        icon: '/assets/img/kbn-logo.png',
        badge: '/assets/img/kbn-badge.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Details',
                icon: '/assets/img/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/img/xmark.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('KBN Financial Boutique', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        // Open the app when notification is clicked
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
}); 