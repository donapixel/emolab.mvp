/* ---------- src/main.jsx ----------
   Punto de entrada de la app (lo que Vite usa como entry en index.html).
   Monta <App /> e inyecta los estilos globales de theme.js, y registra el
   Service Worker para que EmoLab funcione como PWA instalable. */

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { GLOBAL_CSS } from "./theme";

// Inyecta @font-face, .emo-btn, keyframes, etc. una sola vez al cargar la app.
const styleTag = document.createElement("style");
styleTag.textContent = GLOBAL_CSS;
document.head.appendChild(styleTag);

createRoot(document.getElementById("root")).render(<App />);

// ---------- Registro del Service Worker (instalación + caché offline) ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("[main] No se pudo registrar el Service Worker:", err);
    });
  });
}
