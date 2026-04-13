self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

// Periodic Background Sync
self.addEventListener('periodicsync', (e) => {
  if (e.tag === 'water-reminder') {
    e.waitUntil(showWaterReminder());
  }
});

// Fallback: Push notification (nếu server gửi)
self.addEventListener('push', (e) => {
  const data = e.data?.json() ?? {};
  e.waitUntil(
    self.registration.showNotification(data.title ?? '💧 Nhắc uống nước', {
      body: data.body ?? 'Đã đến giờ uống nước rồi! Uống 1 ly nhé.',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'water-reminder',
      renotify: true,
    })
  );
});

async function showWaterReminder() {
  return self.registration.showNotification('💧 Nhắc uống nước', {
    body: 'Đã đến giờ uống nước rồi! Uống 1 ly nhé.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'water-reminder',
    renotify: true,
    actions: [
      { action: 'logged', title: '✓ Đã uống' },
      { action: 'dismiss', title: 'Bỏ qua' },
    ],
  });
}

// Xử lý khi user click vào notification
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  if (e.action === 'logged') {
    e.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        if (clientList.length > 0) {
          clientList[0].focus();
          clientList[0].postMessage({ type: 'WATER_LOGGED' });
        } else {
          clients.openWindow('/dashboard');
        }
      })
    );
  }
});