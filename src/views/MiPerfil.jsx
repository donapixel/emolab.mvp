/* ---------- views/MiPerfil.jsx ----------
   Vista "Mi Perfil": avatar + nombre, Nube Emocional automática, gráfico semanal,
   episodios marcados para terapia, historial reciente, y autoevaluación de IE.

   Cambios de esta iteración:
   - "Autoevaluación de IE" pasó de ser una fila chica a un botón destacado tipo
     tarjeta (mismo lenguaje visual que "Pista Emocional" en Glosario), con degradé
     propio para diferenciarlo.
   - (La duplicación "Para llevar a terapia" / "Marcados para terapia" ya se había
     resuelto antes: acá solo queda "Marcados para terapia", una sola vez.) */

import React, { useState, useEffect } from "react";
import { Flag, ChevronLeft, Sparkles } from "lucide-react";
import { THEME, F, D, FN, VIEW_TITLE_STYLE, VIEW_SUBTITLE_STYLE } from "../theme";
import {
  STATES, PRIMARY_ORDER, PRIMARY_EMOTIONS, SURFACE_TO_PRIMARY,
  AVATAR_MUJER_IMG, AVATAR_HOMBRE_IMG, NUBE_BASE_IMG, NUBE_LAYER_IMG,
  CLOUD_EMOTION_COLORS, CLOUD_NEUTRAL, IE_BRANCHES, IE_ITEMS,
} from "../data/constants";

/* ---------- Atajos UI compartidos (inlineados para que este archivo sea autocontenido) ---------- */
function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 4, color: THEME.ink, background: "none", border: "none", fontFamily: F, fontSize: 14, cursor: "pointer", marginBottom: 12, padding: 0 }}>
      <ChevronLeft size={16} /> Volver
    </button>
  );
}
function PrimaryButton({ children, onClick, disabled, color }) {
  return (
    <button className="emo-btn" onClick={onClick} disabled={disabled} style={{
      width: "100%", padding: "18px", borderRadius: 999, border: "none",
      background: disabled ? THEME.line : (color || THEME.gradient), color: "#fff",
      fontFamily: F, fontWeight: 700, fontSize: 16, cursor: disabled ? "default" : "pointer",
      boxShadow: disabled ? "none" : "0 4px 14px rgba(0,0,0,0.16)",
    }}>{children}</button>
  );
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function mode(arr) {
  if (!arr.length) return null;
  const counts = {};
  arr.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

/* ---------- Persistencia ---------- */
async function loadIeResults() {
  try { const res = await window.storage.get("emolab-ie-results", false); return res ? JSON.parse(res.value) : []; }
  catch (e) { return []; }
}
async function saveIeResults(results) {
  try { await window.storage.set("emolab-ie-results", JSON.stringify(results), false); }
  catch (e) { console.error("storage error", e); }
}

/* ---------- Nube Emocional: placeholder gris o capas por imagen (ver data/constants.js) ---------- */
function EmotionCloudVisual({ counts }) {
  const hasImages = !!NUBE_BASE_IMG;
  return (
    <div style={{
      position: "relative", width: "100%", aspectRatio: "4 / 3", borderRadius: 28, overflow: "hidden",
      background: hasImages ? "transparent" : "#E0E0E0",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {hasImages ? (
        <>
          <img src={NUBE_BASE_IMG} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
          {PRIMARY_ORDER.map((k) => NUBE_LAYER_IMG[k] && (
            <img key={k} src={NUBE_LAYER_IMG[k]} alt="" style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain",
              opacity: counts[k] > 0 ? 1 : 0, transition: "opacity 0.6s ease", pointerEvents: "none",
            }} />
          ))}
        </>
      ) : (
        <span style={{ fontFamily: F, fontSize: 12, color: "#9E9E9E", textAlign: "center", padding: "0 24px" }}>
          Nube emocional (placeholder)
        </span>
      )}
    </div>
  );
}

function EmotionalCloud({ entries }) {
  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const counts = {};
  PRIMARY_ORDER.forEach((k) => { counts[k] = 0; });
  entries.filter((e) => e.timestamp >= weekAgo).forEach((e) => {
    const primary = SURFACE_TO_PRIMARY[e.surfaceEmotionId];
    if (primary && counts[primary] !== undefined) counts[primary] += 1;
  });
  const amplitude = PRIMARY_ORDER.filter((k) => counts[k] > 0).length;

  return (
    <div>
      <div style={{ fontFamily: F, fontSize: 11, color: THEME.ink, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, textAlign: "center", marginBottom: 2 }}>
        Tu nube emocional
      </div>
      <p style={{ fontFamily: F, fontSize: 12, color: THEME.ink, textAlign: "center", marginBottom: 10, lineHeight: 1.4 }}>
        Se colorea sola con cada check-in: gris para lo que todavía no sentiste esta semana.
      </p>

      <div style={{ position: "relative", width: "100%", maxWidth: 200, margin: "16px auto" }}>
        <EmotionCloudVisual counts={counts} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 14 }}>
        {PRIMARY_ORDER.map((k) => {
          const active = counts[k] > 0;
          const color = active ? CLOUD_EMOTION_COLORS[k] : CLOUD_NEUTRAL;
          return (
            <div key={k} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "6px 11px", borderRadius: 999,
              border: `1.5px solid ${active ? color : THEME.line}`,
              background: active ? `${color}1E` : "transparent",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, transition: "background 0.4s ease" }} />
              <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: active ? 700 : 400, color: active ? color : THEME.inkSoft }}>
                {PRIMARY_EMOTIONS[k].label} {active ? `· ${counts[k]}` : ""}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 10, fontFamily: F, fontSize: 12.5, color: THEME.ink, fontWeight: 600 }}>
        {amplitude} de {PRIMARY_ORDER.length} emociones sentidas esta semana
      </div>
    </div>
  );
}

/* ---------- Gráfico de barras de los últimos 7 días ---------- */
function SimpleBarChart({ data, height = 130 }) {
  const max = Math.max(1, ...data.map((d) => d.total));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height, width: "100%" }}>
      {data.map((d, i) => {
        const barH = Math.max(4, (d.total / max) * (height - 22));
        const fill = d.dominant ? STATES[d.dominant].color : THEME.line;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <div style={{ width: "70%", maxWidth: 20, height: barH, background: fill, borderRadius: 6, transition: "height 0.4s ease" }} />
            <div style={{ fontSize: 11, fontFamily: F, color: THEME.ink, marginTop: 4 }}>{d.day}</div>
          </div>
        );
      })}
    </div>
  );
}

function EntryCard({ entry, onToggleFlag }) {
  const info = STATES[entry.state] || STATES.sin_clasificar;
  const date = new Date(entry.timestamp);
  return (
    <div style={{ borderBottom: `1px solid ${THEME.line}`, padding: "12px 0", display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: info.color, marginTop: 5, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F, fontSize: 12, color: THEME.ink }}>
          {date.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" })} · {entry.surfaceEmotion || "Sin nombrar"}
        </div>
        <div style={{ fontFamily: F, fontSize: 14, color: THEME.ink, marginTop: 2 }}>
          {(Array.isArray(entry.sensation) ? entry.sensation.join(", ") : entry.sensation)} {entry.granular ? `· ${entry.granular}` : ""} {entry.necesidad ? `· necesita ${entry.necesidad.toLowerCase()}` : ""}
        </div>
        {entry.deepenText && <div style={{ fontFamily: D, fontStyle: "italic", fontSize: 13, color: THEME.ink, marginTop: 4 }}>"{entry.deepenText}"</div>}
      </div>
      <button onClick={() => onToggleFlag(entry.id)} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }} aria-label="Marcar para terapia">
        <Flag size={17} color={entry.flagged ? THEME.gold : THEME.line} fill={entry.flagged ? THEME.gold : "none"} />
      </button>
    </div>
  );
}

/* ---------- Autoevaluación de Inteligencia Emocional ---------- */
function IETest({ onDone, onCancel }) {
  const [answers, setAnswers] = useState({});
  const allAnswered = IE_ITEMS.every((it) => answers[it.id]);

  const submit = async () => {
    const branchScores = {};
    Object.keys(IE_BRANCHES).forEach((b) => {
      const items = IE_ITEMS.filter((it) => it.branch === b);
      const sum = items.reduce((acc, it) => acc + (answers[it.id] || 0), 0);
      branchScores[b] = sum / items.length;
    });
    const result = { id: uid(), timestamp: Date.now(), scores: branchScores };
    const current = await loadIeResults();
    await saveIeResults([result, ...current]);
    onDone(result);
  };

  return (
    <div style={{ padding: "24px 20px" }}>
      <BackBtn onClick={onCancel} />
      <h2 style={{ fontFamily: D, fontSize: 19, color: THEME.ink, marginBottom: 4 }}>Autoevaluación de IE</h2>
      <p style={{ fontFamily: F, fontSize: 12.5, color: THEME.ink, marginBottom: 18, lineHeight: 1.5 }}>
        Inspirada en el modelo de las 4 ramas de Mayer y Salovey. No reemplaza un test clínico validado (como el MSCEIT): es una herramienta reflexiva para conversar en terapia.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {IE_ITEMS.map((it) => (
          <div key={it.id}>
            <div style={{ fontFamily: F, fontSize: 14, color: THEME.ink, marginBottom: 8, lineHeight: 1.4 }}>{it.text}</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setAnswers((a) => ({ ...a, [it.id]: n }))} style={{
                  flex: 1, padding: "8px 0", borderRadius: 10, border: `2px solid ${answers[it.id] === n ? THEME.gold : THEME.line}`,
                  background: answers[it.id] === n ? `${THEME.gold}22` : THEME.card, fontFamily: F, fontSize: 13, color: THEME.ink, cursor: "pointer",
                }}>{n}</button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
              <span style={{ fontFamily: F, fontSize: 10, color: THEME.ink }}>Nunca</span>
              <span style={{ fontFamily: F, fontSize: 10, color: THEME.ink }}>Siempre</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <PrimaryButton disabled={!allAnswered} color={THEME.gold} onClick={submit}>Ver resultado</PrimaryButton>
      </div>
    </div>
  );
}

function ieCategory(avg) {
  if (avg < 2.5) return { label: "Terreno para explorar", desc: "Recién estás empezando a poner nombre y forma a esto. Es un buen momento para trabajarlo en terapia." };
  if (avg < 3.4) return { label: "En desarrollo", desc: "Ya reconocés algunas señales, pero todavía cuesta sostenerlas. Hay margen para afinar la percepción y la regulación." };
  if (avg < 4.3) return { label: "Con buen manejo", desc: "Manejás bastante bien tu mundo emocional, con algunas ramas más entrenadas que otras." };
  return { label: "Muy entrenada", desc: "Tenés un manejo fino de tus emociones en la mayoría de las ramas evaluadas." };
}

function IEResult({ result, onClose }) {
  const max = 5;
  const values = Object.values(result.scores);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const cat = ieCategory(avg);
  const radarData = Object.entries(IE_BRANCHES).map(([key, b]) => ({
    branch: b.label.split(" ")[0], full: b.label, score: result.scores[key] || 0, color: b.color,
  }));

  return (
    <div style={{ padding: "24px 20px" }}>
      <BackBtn onClick={onClose} />
      <h2 style={{ fontFamily: D, fontSize: 19, color: THEME.ink, marginBottom: 4 }}>Tu resultado</h2>
      <p style={{ fontFamily: F, fontSize: 12.5, color: THEME.ink, marginBottom: 6 }}>
        {new Date(result.timestamp).toLocaleDateString("es-AR", { day: "numeric", month: "long" })}
      </p>
      <p style={{ fontFamily: F, fontSize: 13.5, fontWeight: 600, color: THEME.ink, marginBottom: 4 }}>{cat.label}</p>
      <p style={{ fontFamily: F, fontSize: 12.5, color: THEME.ink, marginBottom: 18, lineHeight: 1.5 }}>{cat.desc}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {radarData.map((r) => (
          <div key={r.full}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
              <span style={{ fontFamily: F, fontSize: 13.5, color: THEME.ink }}>{r.full}</span>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: THEME.line, overflow: "hidden" }}>
              <div style={{ width: `${(r.score / max) * 100}%`, height: "100%", background: r.color, borderRadius: 999, transition: "width 0.6s ease" }} />
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: F, fontSize: 12, color: THEME.ink, marginTop: 22, lineHeight: 1.5 }}>
        Llevá este perfil a tu sesión: la barra más corta suele ser un buen punto de partida para trabajar.
      </p>
    </div>
  );
}

/* ==================== Vista principal de Mi Perfil ==================== */
export default function MiPerfil({ entries, onToggleFlag, profile, onLogout, onGoToRescate }) {
  const [ieView, setIeView] = useState("closed"); // closed | test | result
  const [lastIe, setLastIe] = useState(null);
  const [viewingResult, setViewingResult] = useState(null);

  useEffect(() => {
    loadIeResults().then((r) => { if (r.length) setLastIe(r[0]); });
  }, []);

  if (ieView === "test") {
    return <IETest onCancel={() => setIeView("closed")} onDone={(result) => { setLastIe(result); setViewingResult(result); setIeView("result"); }} />;
  }
  if (ieView === "result") {
    return <IEResult result={viewingResult} onClose={() => setIeView("closed")} />;
  }

  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const weekEntries = entries.filter((e) => e.timestamp >= weekAgo);

  const chartData = days.map((d, i) => {
    const dayEntries = weekEntries.filter((e) => new Date(e.timestamp).getDay() === i);
    const dominant = dayEntries.length ? mode(dayEntries.map((e) => e.state)) : null;
    return { day: d, total: dayEntries.length, dominant };
  });

  const flagged = entries.filter((e) => e.flagged);

  return (
    <div style={{ padding: "0 20px 20px", boxSizing: "border-box", background: "#FFF9EB" }}>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 16, padding: "8px 0", marginBottom: 20 }}>
        <img
          src={profile?.sexo === "Masculino" ? AVATAR_HOMBRE_IMG : AVATAR_MUJER_IMG}
          alt="Foto de perfil"
          style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "3px solid #FFF", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", flexShrink: 0 }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h2 style={{ ...VIEW_TITLE_STYLE, fontWeight: "bold", margin: 0 }}>
            {profile?.nombre ? `${profile.nombre} ${profile.apellido || ""}${profile.edad ? `, ${profile.edad} años` : ""}` : "Mi perfil"}
          </h2>
          <p style={{ ...VIEW_SUBTITLE_STYLE, margin: 0 }}>{weekEntries.length} check-ins esta semana</p>
        </div>
      </div>

      <EmotionalCloud entries={entries} />
      <div style={{ borderTop: `1px solid ${THEME.line}`, marginTop: 18, paddingTop: 16, marginBottom: 26 }}>
        <SimpleBarChart data={chartData} height={130} />
      </div>

      <h3 style={{ fontFamily: D, fontSize: 16, color: THEME.ink, margin: "0 0 10px" }}>Marcados para terapia</h3>
      {flagged.length === 0 ? (
        <p style={{ fontFamily: F, fontSize: 13, color: THEME.ink }}>Marcá un episodio con la bandera para guardarlo acá.</p>
      ) : flagged.map((e) => <EntryCard key={e.id} entry={e} onToggleFlag={onToggleFlag} />)}

      <h3 style={{ fontFamily: D, fontSize: 16, color: THEME.ink, margin: "22px 0 10px" }}>Historial reciente</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {entries.slice(0, 12).map((e) => <EntryCard key={e.id} entry={e} onToggleFlag={onToggleFlag} />)}
        {entries.length === 0 && <p style={{ fontFamily: F, fontSize: 13, color: THEME.ink }}>Todavía no hay check-ins.</p>}
      </div>

      {/* NUEVO: botón destacado para el Test de Inteligencia Emocional, mismo lenguaje visual que "Pista Emocional" */}
      <button className="emo-btn" onClick={() => (lastIe ? (setViewingResult(lastIe), setIeView("result")) : setIeView("test"))} style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left",
        padding: "18px 20px", borderRadius: 26, border: "2px solid #ffffff70",
        background: "linear-gradient(120deg, #3FA9C9 0%, #6CCF99 100%)",
        boxShadow: "0 8px 22px rgba(63,169,201,0.4)",
        cursor: "pointer", marginTop: 24,
      }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#ffffff40", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Sparkles size={22} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#fff", fontFamily: FN }}>Test de Inteligencia Emocional (IE)</div>
          <div style={{ fontSize: 12.5, color: "#ffffffe0", fontFamily: F, marginTop: 2 }}>
            {lastIe ? `Última vez: ${new Date(lastIe.timestamp).toLocaleDateString("es-AR", { day: "numeric", month: "short" })} · tocá para ver tu resultado` : "8 preguntas rápidas para tu perfil emocional"}
          </div>
        </div>
        <ChevronLeft size={18} color="#fff" style={{ transform: "rotate(180deg)", flexShrink: 0 }} />
      </button>
      {lastIe && (
        <button onClick={() => setIeView("test")} style={{
          width: "100%", background: "none", border: "none", marginTop: 10, padding: "6px",
          fontFamily: F, fontSize: 12.5, color: THEME.inkSoft, textDecoration: "underline", cursor: "pointer",
        }}>
          Repetir el test
        </button>
      )}

      <button onClick={onLogout} style={{
        marginTop: 16, width: "100%", background: "none", border: `1px solid ${THEME.line}`, borderRadius: 999,
        padding: "13px", fontFamily: F, fontSize: 14, color: THEME.ink, cursor: "pointer",
      }}>
        Cerrar sesión
      </button>
    </div>
  );
}
