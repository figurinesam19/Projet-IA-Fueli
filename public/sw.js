/* Service worker Fueli — réception des notifications push + clic. */

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Fueli", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Fueli";
  const options = {
    body: data.body || "",
    icon: "/apple-icon.png",
    badge: "/apple-icon.png",
    tag: data.tag || "fueli-reminder",
    data: { url: data.url || "/scan" },
    vibrate: [80, 40, 80],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/scan";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // Si une fenêtre de l'app est déjà ouverte, on la réutilise.
        for (const client of clients) {
          if ("focus" in client) {
            client.navigate(target);
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(target);
        }
      }),
  );
});
