/* ---------- public/sw.js ----------
   Service Worker básico de EmoLab: cachea el app shell para que la PWA se
   pueda instalar y abrir offline (o con conexión inestable). No cachea las
   llamadas a Supabase (esas siempre van directo a la red). */

const CACHE_NAME = "emolab-cache-v1";

/* App shell mínimo. Vite agrega hashes a los archivos de /assets/*.js|css
   generados en el build, así que esos se cachean solos la primera vez que
   se piden (ver el fetch handler más abajo) — acá solo precacheamos lo que
   sabemos que existe con nombre fijo. */
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/logo.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch((err) => console.warn("[sw] No se pudo precachear todo el app shell:", err))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Solo cacheamos GET; todo lo demás (POST a Supabase, etc.) va directo a la red.
  if (request.method !== "GET") return;

  // Nunca cachear llamadas a Supabase: siempre tienen que ir a la red.
  if (request.url.includes("supabase.co")) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Solo cacheamos respuestas válidas del mismo origen.
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Sin red y sin caché para esta URL: si era una navegación, devolvé el shell.
          if (request.mode === "navigate") return caches.match("/index.html");
          return undefined;
        });
    })
  );
});
