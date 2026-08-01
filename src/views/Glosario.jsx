/* ---------- views/Glosario.jsx ----------
   Vista "Mi glosario emocional": tarjetas de las 6 emociones universales +
   emociones complejas + entrada al minijuego "Pista Emocional".

   Ajuste de esta iteración: las tarjetas de emoción (afecta a las 6, incluida
   Enojo) ahora muestran colapsadas SOLO la imagen + el nombre + la definición
   corta. Todo lo demás (disparador, señales físicas, sensaciones corporales,
   mensaje implícito, estado de ánimo, rasgo, acciones y los términos derivados)
   pasó a vivir adentro del desplegable, que se abre tocando la tarjeta. */

import React, { useState, useEffect } from "react";
import { BookOpen, ChevronLeft, Sparkles } from "lucide-react";
import { THEME, F, D, FN, VIEW_TITLE_STYLE, VIEW_SUBTITLE_STYLE } from "../theme";
import { PRIMARY_EMOTIONS, COMPLEX_EMOTIONS, PISTA_JUEGO_IMG } from "../data/constants";
import { Minijuego, loadGameProgress } from "./Juegos";

/* ---------- Tarjeta de una emoción universal (colapsada = solo lo esencial) ---------- */
function GlossaryCard({ g, dominada }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: `${g.color}1C`, borderRadius: 22, padding: "18px 20px",
      border: dominada ? `2px solid ${THEME.gold}` : "none",
      boxShadow: dominada ? `0 0 0 3px ${THEME.gold}22` : "none",
    }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {g.image && (
              <img src={g.image} alt="" style={{ width: 52, height: 52, objectFit: "contain", borderRadius: 12, flexShrink: 0 }} />
            )}
            <div style={{ fontFamily: D, fontSize: 20, fontWeight: "bold", color: THEME.ink }}>{g.label}</div>
            {dominada && <span title="Emoción dominada">🏅</span>}
          </div>
          <ChevronLeft size={16} color={THEME.inkSoft} style={{ transform: open ? "rotate(90deg)" : "rotate(-90deg)", transition: "transform 0.25s ease" }} />
        </div>
        {/* Colapsado: solo la definición corta. Todo el resto se movió adentro de `open`. */}
        <div style={{ fontFamily: F, fontSize: 13.5, color: THEME.ink, lineHeight: 1.5, margin: 0 }}>{g.texto}</div>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${THEME.line}`, marginTop: 12, paddingTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {g.derivados.map((d) => (
              <span key={d} style={{ fontFamily: F, fontSize: 11, color: THEME.ink, background: `${g.color}18`, padding: "3px 9px", borderRadius: 999 }}>{d}</span>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: g.color, marginBottom: 3 }}>Se dispara con</div>
            <div style={{ fontFamily: F, fontSize: 13, color: THEME.ink, lineHeight: 1.45 }}>{g.trigger}</div>
          </div>
          <div>
            <div style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: g.color, marginBottom: 3 }}>Señales físicas y faciales</div>
            <div style={{ fontFamily: F, fontSize: 13, color: THEME.ink, lineHeight: 1.45 }}>{g.physicalSigns.join(" · ")}</div>
          </div>
          <div>
            <div style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: g.color, marginBottom: 3 }}>Sensaciones corporales</div>
            <div style={{ fontFamily: F, fontSize: 13, color: THEME.ink, lineHeight: 1.45 }}>{g.bodySensations}</div>
          </div>
          <div>
            <div style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: g.color, marginBottom: 3 }}>Mensaje implícito</div>
            <div style={{ fontFamily: D, fontStyle: "italic", fontSize: 13.5, color: THEME.ink, lineHeight: 1.45 }}>"{g.message}"</div>
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: g.color, marginBottom: 3 }}>Estado de ánimo</div>
              <div style={{ fontFamily: F, fontSize: 13, color: THEME.ink, lineHeight: 1.4 }}>{g.mood}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: g.color, marginBottom: 3 }}>Rasgo asociado</div>
              <div style={{ fontFamily: F, fontSize: 13, color: THEME.ink, lineHeight: 1.4 }}>{g.trait}</div>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: g.color, marginBottom: 3 }}>Acciones espontáneas</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {g.actionsIntrinsic.map((a) => (
                <span key={a} style={{ fontFamily: F, fontSize: 11, color: THEME.inkSoft, background: "#ffffff90", padding: "3px 8px", borderRadius: 999 }}>{a}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: g.color, marginBottom: 3 }}>Acciones de regulación</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {g.actionsRegulation.map((a) => (
                <span key={a} style={{ fontFamily: F, fontSize: 11, color: "#fff", background: g.color, padding: "3px 8px", borderRadius: 999 }}>{a}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComplexEmotionCard({ c }) {
  return (
    <div style={{ background: "#F0E6D2", borderRadius: 18, padding: "13px 16px" }}>
      <div style={{ fontFamily: D, fontSize: 14.5, color: THEME.ink, marginBottom: 3 }}>{c.label}</div>
      <div style={{ fontFamily: F, fontSize: 12.5, color: THEME.ink, lineHeight: 1.45, marginBottom: c.involved.length ? 7 : 0 }}>{c.description}</div>
      {c.involved.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {c.involved.map((i) => (
            <span key={i} style={{ fontFamily: F, fontSize: 10.5, color: THEME.inkSoft, background: "#ffffff90", padding: "2px 8px", borderRadius: 999 }}>{i}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Glosario({ entries, onGoToRescate }) {
  const [gameProgress, setGameProgress] = useState({});
  const [showGame, setShowGame] = useState(false);
  const [showComplex, setShowComplex] = useState(false);

  useEffect(() => {
    loadGameProgress().then(setGameProgress);
  }, []);

  if (showGame) {
    return <Minijuego entries={entries} onExit={() => setShowGame(false)} onGoToRescate={onGoToRescate} />;
  }

  return (
    <div style={{ padding: "0 20px 20px", boxSizing: "border-box", background: "#FFF9EB" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <BookOpen size={19} color={THEME.ink} />
        <h2 style={VIEW_TITLE_STYLE}>Mi glosario emocional</h2>
      </div>
      <p style={{ ...VIEW_SUBTITLE_STYLE, marginBottom: 18 }}>Las emociones universales y para qué sirve cada una. Tocá una tarjeta para ver el detalle completo.</p>

      <button className="emo-btn" onClick={() => setShowGame(true)} style={{
        position: "relative", display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left",
        padding: "18px 20px", borderRadius: 26, border: "2px solid #ffffff70",
        background: "linear-gradient(120deg, #FD9D62 0%, #F4D03F 100%)",
        boxShadow: "0 8px 22px rgba(253,157,98,0.4)",
        cursor: "pointer", marginBottom: 22, overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 10, right: -30, transform: "rotate(35deg)", background: "#fff",
          padding: "3px 34px", fontFamily: FN, fontWeight: 800, fontSize: 10, color: "#D9662B", letterSpacing: 0.3,
        }}>¡JUGÁ AHORA!</div>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#ffffff40", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
          <img src={PISTA_JUEGO_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
          <Sparkles size={22} color="#fff" style={{ display: "none" }} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17, color: "#fff", fontFamily: FN }}>Pista Emocional</div>
          <div style={{ fontSize: 12.5, color: "#ffffffe0", fontFamily: F, marginTop: 2 }}>Practicá con la emoción que más apareció esta semana</div>
        </div>
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Object.entries(PRIMARY_EMOTIONS).map(([key, g]) => (
          <GlossaryCard key={key} g={g} dominada={gameProgress[key]?.dominada} />
        ))}
      </div>

      <button onClick={() => setShowComplex((s) => !s)} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
        background: "none", border: "none", padding: "20px 2px 10px", cursor: "pointer",
      }}>
        <h3 style={{ fontFamily: D, fontSize: 16.5, color: THEME.ink, margin: 0 }}>Emociones complejas</h3>
        <ChevronLeft size={16} color={THEME.inkSoft} style={{ transform: showComplex ? "rotate(90deg)" : "rotate(-90deg)", transition: "transform 0.25s ease" }} />
      </button>
      {!showComplex && (
        <p style={{ fontFamily: F, fontSize: 12.5, color: THEME.inkSoft, margin: "0 0 6px" }}>
          Combinaciones de las emociones universales: amor, celos, envidia, vergüenza y más.
        </p>
      )}
      {showComplex && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
          {COMPLEX_EMOTIONS.map((c) => <ComplexEmotionCard key={c.label} c={c} />)}
        </div>
      )}
    </div>
  );
}
