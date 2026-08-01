/* ---------- src/main.jsx ----------
   Punto de entrada de la app (lo que Vite usa como entry en index.html).
   Monta <App /> e inyecta los estilos globales de theme.js, y registra el
   Service Worker para que EmoLab funcione como PWA instalable. */

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Inyecta @font-face, .emo-btn, keyframes, etc. una sola vez al cargar la app.


createRoot(document.getElementById("root")).render(<App />);

// ---------- Registro del Service Worker (instalación + caché offline) ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("[main] No se pudo registrar el Service Worker:", err);
    });
  });
}
