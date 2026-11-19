// Service worker de la app Nova Floe (chat web). Muestra las notificaciones y abre la app al tocarlas.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function () { /* sin caché: siempre lo último del inventario */ });

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { titulo: 'Nova Floe', cuerpo: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Nova Floe', {
    body: d.cuerpo || '', icon: '/chat/icono-192.png', badge: '/chat/icono-192.png',
    data: { url: d.url || '/chat/' }, tag: d.tag || undefined, renotify: !!d.tag, lang: 'es'
  }));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/chat/';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (lista) {
    for (var i = 0; i < lista.length; i++) { var c = lista[i]; if ('focus' in c) { try { c.navigate(url); } catch (x) {} return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
