/* ---------- views/Rescate.jsx ----------
   Vista "Botón de rescate". Ahora con selector de 3 vías de autorregulación:
     A) Ejercicio Corporal / Respiración (el flujo que ya existía, sin cambios)
     B) Diario Expresivo (texto libre, "¿Qué me pasa hoy?", guardar/limpiar)
     C) Canvas de Dibujo (trazo libre con selector de color, mouse/touch) */

import React, { useState, useEffect, useRef } from "react";
import { Wind, Zap, Check, ChevronLeft, PenLine, Palette } from "lucide-react";
import { THEME, F, D, FN, VIEW_TITLE_STYLE, VIEW_SUBTITLE_STYLE } from "../theme";
import { STATES, RESCATE_OPTIONS, BREATHING_TECHNIQUES, BREATHING_DURATIONS, SIX_SECOND_TASKS } from "../data/constants";
import { saveDiarioRecord } from "../lib/supabaseClient";

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

/* ---------- Sonido/haptic suaves para marcar cambios de fase, sin archivos externos ---------- */
let sharedAudioCtx = null;
function playTone(freq = 420, duration = 150) {
  try {
    if (!sharedAudioCtx) sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = sharedAudioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000 + 0.02);
  } catch (e) { /* audio no disponible, seguimos sin sonido */ }
}
function hapticPulse() {
  try { if (navigator.vibrate) navigator.vibrate(25); } catch (e) { /* no disponible */ }
}

/* ---------- Persistencia ---------- */
async function loadBreathingSessions() {
  try { const res = await window.storage.get("emolab-breathing-sessions", false); return res ? JSON.parse(res.value) : []; }
  catch (e) { return []; }
}
async function saveBreathingSessions(sessions) {
  try { await window.storage.set("emolab-breathing-sessions", JSON.stringify(sessions), false); }
  catch (e) { console.error("storage error", e); }
}
async function loadSixSecondSessions() {
  try { const res = await window.storage.get("emolab-sixsecond-sessions", false); return res ? JSON.parse(res.value) : []; }
  catch (e) { return []; }
}
async function saveSixSecondSessions(sessions) {
  try { await window.storage.set("emolab-sixsecond-sessions", JSON.stringify(sessions), false); }
  catch (e) { console.error("storage error", e); }
}
async function loadDiarioEntries() {
  try { const res = await window.storage.get("emolab-diario-entries", false); return res ? JSON.parse(res.value) : []; }
  catch (e) { return []; }
}
async function saveDiarioEntries(entries) {
  try { await window.storage.set("emolab-diario-entries", JSON.stringify(entries), false); }
  catch (e) { console.error("storage error", e); }
}

/* ---------- Gráfico guiado de pose/ejercicio: pictograma con fases y flechas ---------- */
const POSE_TYPE_BY_EXID = {
  empuje: "push", sacudida: "shake", tension: "squeeze",
  autocontencion: "handsChest", apertura_pecho: "chestOpen", contacto_tierra: "ground",
  orientacion: "lookSide", costillas: "ribBreath", mandibula: "jaw", saboreo: "calm",
  bronca: "push", ansiedad_acel: "lookSide", angustia_col: "handsChest", miedo_desc: "jaw",
  verguenza_culpa: "handsChest",
};
const POSE_CONFIG = {
  push:       { armL: 76, armR: 76, legL: 12, legR: -8 },
  shake:      { armL: 38, armR: -38, legL: 16, legR: -16 },
  squeeze:    { armL: 104, armR: -104, legL: 4, legR: -4 },
  handsChest: { armL: 56, armR: -20, legL: 0, legR: 0 },
  chestOpen:  { armL: 150, armR: -150, legL: 0, legR: 0 },
  ground:     { armL: 14, armR: -14, legL: 9, legR: -9 },
  lookSide:   { armL: 10, armR: -10, legL: 0, legR: 0 },
  ribBreath:  { armL: 62, armR: -62, legL: 0, legR: 0 },
  jaw:        { armL: 10, armR: -10, legL: 0, legR: 0 },
  calm:       { armL: 20, armR: -20, legL: 6, legR: -6 },
};

function PoseFigure({ type, accent, size = 150 }) {
  const cfg = POSE_CONFIG[type] || POSE_CONFIG.calm;
  return (
    <svg width={size} height={size} viewBox="0 0 200 190">
      {type === "push" && (
        <>
          <line x1="152" y1="18" x2="152" y2="170" stroke={THEME.line} strokeWidth="6" strokeDasharray="3 6" />
          <path d="M118 58 L142 58 M134 50 L142 58 L134 66" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {type === "shake" && (
        <>
          <path d="M50 56 l-8 -6 l8 -6 M150 56 l8 -6 l-8 -6" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
          <path d="M62 168 l-8 6 M138 168 l8 6" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        </>
      )}
      {type === "squeeze" && (
        <>
          {[[54, 92], [146, 92]].map(([cx, cy], i) => (
            <g key={i} opacity="0.8">
              <line x1={cx - 12} y1={cy} x2={cx - 20} y2={cy} stroke={accent} strokeWidth="3" strokeLinecap="round" />
              <line x1={cx + 12} y1={cy} x2={cx + 20} y2={cy} stroke={accent} strokeWidth="3" strokeLinecap="round" />
              <line x1={cx} y1={cy - 12} x2={cx} y2={cy - 20} stroke={accent} strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
        </>
      )}
      {type === "handsChest" && (
        <>
          <circle cx="88" cy="66" r="13" fill={accent} opacity="0.16" />
          <circle cx="112" cy="94" r="13" fill={accent} opacity="0.16" />
        </>
      )}
      {type === "chestOpen" && (
        <path d="M100 40 L100 20 M92 28 L100 20 L108 28" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {type === "ground" && (
        <>
          <line x1="55" y1="172" x2="145" y2="172" stroke={THEME.line} strokeWidth="6" strokeLinecap="round" />
          <path d="M85 168 L85 152 M79 160 L85 152 L91 160" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M115 168 L115 152 M109 160 L115 152 L121 160" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {type === "lookSide" && (
        <>
          <path d="M62 26 Q100 10 138 26" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 6" />
          <circle cx="60" cy="34" r="4" fill={accent} opacity="0.6" />
          <circle cx="140" cy="34" r="4" fill={accent} opacity="0.6" />
        </>
      )}
      {type === "ribBreath" && (
        <>
          <path d="M56 84 L38 84 M46 76 L38 84 L46 92" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M144 84 L162 84 M154 76 L162 84 L154 92" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {type === "jaw" && (
        <ellipse cx="100" cy="42" rx="7" ry="9" fill="none" stroke={accent} strokeWidth="3" strokeDasharray="2 4" />
      )}
      {type === "calm" && (
        <>
          <circle cx="100" cy="70" r="34" fill={accent} opacity="0.08" />
          <path d="M78 24 l3 -7 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 Z" fill={accent} opacity="0.5" />
        </>
      )}
      <g transform={`rotate(${cfg.legL} 90 112)`}>
        <line x1="90" y1="112" x2="90" y2="168" stroke={THEME.ink} strokeWidth="7" strokeLinecap="round" />
      </g>
      <g transform={`rotate(${cfg.legR} 110 112)`}>
        <line x1="110" y1="112" x2="110" y2="168" stroke={THEME.ink} strokeWidth="7" strokeLinecap="round" />
      </g>
      <line x1="100" y1="50" x2="100" y2="112" stroke={THEME.ink} strokeWidth="8" strokeLinecap="round" />
      <g transform={`rotate(${cfg.armL} 90 58)`}>
        <line x1="90" y1="58" x2="90" y2="102" stroke={accent} strokeWidth="7" strokeLinecap="round" />
        <circle cx="90" cy="102" r="6" fill={accent} />
      </g>
      <g transform={`rotate(${cfg.armR} 110 58)`}>
        <line x1="110" y1="58" x2="110" y2="102" stroke={accent} strokeWidth="7" strokeLinecap="round" />
        <circle cx="110" cy="102" r="6" fill={accent} />
      </g>
      <circle cx="100" cy="34" r="16" fill="#fff" stroke={THEME.ink} strokeWidth="6" />
    </svg>
  );
}

function PoseDiagram({ exerciseId, accent, phase, totalPhases, size = 150 }) {
  const type = POSE_TYPE_BY_EXID[exerciseId] || "calm";
  const dotSize = size < 130 ? 18 : 22;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <PoseFigure type={type} accent={accent} size={size} />
      <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
        {Array.from({ length: totalPhases }).map((_, i) => (
          <div key={i} style={{
            width: dotSize, height: dotSize, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            background: i === phase ? accent : "#fff", border: `2px solid ${i === phase ? accent : THEME.line}`,
            color: i === phase ? "#fff" : THEME.inkSoft, fontFamily: F, fontWeight: 700, fontSize: dotSize < 20 ? 10 : 11.5,
            transition: "all 0.25s ease",
          }}>{i + 1}</div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Reproductor de ejercicio guiado ---------- */
function ExercisePlayer({ exercise, accent, onFinish, onCancel }) {
  const [remaining, setRemaining] = useState(exercise.duration);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setRemaining((r) => (r <= 1 ? 0 : r - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const stepDur = exercise.duration / exercise.steps.length;
    const elapsed = exercise.duration - remaining;
    setStepIdx(Math.min(exercise.steps.length - 1, Math.floor(elapsed / stepDur)));
  }, [remaining, exercise]);

  const pct = 1 - remaining / exercise.duration;
  const shakeKeyframes = exercise.mode === "shake" && remaining > 0;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box", overflow: "hidden", padding: "16px 20px 18px" }}>
      <div style={{ flexShrink: 0 }}>
        <BackBtn onClick={onCancel} />
        <div style={{ fontFamily: D, fontSize: 18, color: THEME.ink, textAlign: "center" }}>{exercise.title}</div>
      </div>

      {/* Arriba: la indicación/instrucción del ejercicio */}
      <div style={{
        background: THEME.card, border: `1px solid ${THEME.line}`, borderRadius: 20, padding: "14px 18px",
        textAlign: "center", fontFamily: F, fontSize: 14, color: THEME.ink, margin: "12px 0", flexShrink: 0,
      }}>
        {exercise.steps[stepIdx]}
      </div>

      {/* Centro: gráfico visual a la izquierda, timer a la derecha, todo en el espacio que sobra */}
      <div style={{ flex: "1 1 auto", minHeight: 0, display: "flex", alignItems: "center", justifyContent: "space-evenly", gap: 8 }}>
        <PoseDiagram exerciseId={exercise.id} accent={accent} phase={stepIdx} totalPhases={exercise.steps.length} size={110} />

        <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
          <svg width="110" height="110" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="55" cy="55" r="47" fill="none" stroke={`${accent}33`} strokeWidth="7" />
            <circle cx="55" cy="55" r="47" fill="none" stroke={accent} strokeWidth="7"
              strokeDasharray={2 * Math.PI * 47} strokeDashoffset={2 * Math.PI * 47 * (1 - pct)}
              strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: D, fontSize: 24, color: THEME.ink,
            animation: shakeKeyframes ? "emo-shake 0.3s infinite" : "none",
            transform: exercise.mode === "breathing" && !shakeKeyframes ? `scale(${1 + 0.12 * Math.sin(pct * Math.PI * 6)})` : "none",
            transition: "transform 1s ease",
          }}>{remaining}</div>
        </div>
      </div>

      {/* Abajo: botón claro para terminar el ejercicio */}
      <div style={{ flexShrink: 0, textAlign: "center" }}>
        {remaining === 0 ? (
          <button className="emo-btn" onClick={() => onFinish(true)} style={{ background: THEME.gradient, color: "#fff", border: "none", borderRadius: 999, padding: "13px 30px", fontFamily: FN, fontWeight: 700, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(0,0,0,0.16)" }}>
            <Check size={18} /> Listo
          </button>
        ) : (
          <button className="emo-btn" onClick={() => onFinish(false)} style={{ background: "none", color: THEME.ink, border: `1px solid ${THEME.line}`, borderRadius: 999, padding: "10px 22px", fontFamily: F, fontSize: 13.5, cursor: "pointer" }}>
            Saltear
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- Respiración guiada ---------- */
function BreathingSession({ technique, totalSeconds, onFinish, onCancel }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);

  useEffect(() => {
    hapticPulse();
    playTone(technique.phases[0].mode === "in" ? 520 : 380);
  }, []); // eslint-disable-line

  useEffect(() => {
    const t = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 0.1));
      setPhaseElapsed((pe) => pe + 0.1);
    }, 100);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const phase = technique.phases[phaseIdx];
    if (phaseElapsed >= phase.seconds) {
      const nextIdx = (phaseIdx + 1) % technique.phases.length;
      setPhaseIdx(nextIdx);
      setPhaseElapsed(0);
      hapticPulse();
      playTone(technique.phases[nextIdx].mode === "in" ? 520 : technique.phases[nextIdx].mode === "out" ? 380 : 450);
    }
  }, [phaseElapsed, phaseIdx, technique]);

  const phase = technique.phases[phaseIdx];
  const phasePct = Math.min(1, phaseElapsed / phase.seconds);

  let scale;
  if (phase.mode === "in") scale = 0.62 + phasePct * 0.5;
  else if (phase.mode === "out") scale = 1.12 - phasePct * 0.5;
  else {
    const prevIdx = (phaseIdx - 1 + technique.phases.length) % technique.phases.length;
    scale = technique.phases[prevIdx].mode === "in" ? 1.12 : 0.62;
  }

  const finished = remaining <= 0;
  useEffect(() => { if (finished) onFinish(); }, [finished]); // eslint-disable-line

  const mm = Math.floor(remaining / 60);
  const ss = Math.floor(remaining % 60);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 20px 28px", height: "100%" }}>
      <div style={{ alignSelf: "flex-start" }}><BackBtn onClick={onCancel} /></div>
      <div style={{ fontFamily: D, fontSize: 19, color: THEME.ink, textAlign: "center" }}>{technique.title}</div>
      <div style={{ fontFamily: F, fontSize: 12.5, color: THEME.ink, marginTop: 2 }}>
        {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")} restantes
      </div>

      <div style={{ position: "relative", width: 220, height: 220, margin: "30px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 150, height: 150, borderRadius: "50%",
          background: `radial-gradient(circle, ${THEME.regulado}55 0%, ${THEME.regulado}25 60%, ${THEME.regulado}00 100%)`,
          transform: `scale(${scale})`, transition: "transform 0.1s linear",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 92, height: 92, borderRadius: "50%", background: THEME.regulado, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: D, fontSize: 16, color: "#fff" }}>{phase.label}</span>
          </div>
        </div>
      </div>

      <p style={{ fontFamily: F, fontSize: 12.5, color: THEME.ink, textAlign: "center", maxWidth: 260 }}>{technique.intent}</p>

      <button className="emo-btn" onClick={onCancel} style={{
        marginTop: 20, background: "none", border: `1px solid ${THEME.line}`, borderRadius: 999,
        padding: "10px 22px", fontFamily: F, fontSize: 13.5, color: THEME.ink, cursor: "pointer",
      }}>
        Terminar antes
      </button>
    </div>
  );
}

function BreathingClosing({ onDone }) {
  return (
    <div style={{ padding: "28px 20px", textAlign: "center", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
      <div style={{ width: 46, height: 46, borderRadius: "50%", background: THEME.reguladoSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Wind size={22} color={THEME.regulado} />
      </div>
      <p style={{ fontFamily: D, fontSize: 18, color: THEME.ink, marginBottom: 26 }}>¿Bajó la intensidad de lo que sentías?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 260, margin: "0 auto" }}>
        <PrimaryButton color={THEME.regulado} onClick={() => onDone(true)}>Sí, un poco</PrimaryButton>
        <button className="emo-btn" onClick={() => onDone(false)} style={{
          background: "none", border: `1px solid ${THEME.line}`, borderRadius: 999, padding: "13px",
          fontFamily: F, fontSize: 14.5, color: THEME.ink, cursor: "pointer",
        }}>
          Todavía no
        </button>
      </div>
    </div>
  );
}

/* ---------- Regla de los 6 segundos ---------- */
function SixSecondIntro({ onStart, onCancel }) {
  return (
    <div style={{ padding: "24px 20px" }}>
      <BackBtn onClick={onCancel} />
      <h2 style={{ fontFamily: D, fontSize: 19, color: THEME.ink, marginBottom: 4 }}>Pausa de 6 segundos</h2>
      <p style={{ fontFamily: F, fontSize: 12.5, color: THEME.ink, marginBottom: 18, lineHeight: 1.5 }}>
        Interrumpe la reacción automática dándole a tu cerebro una tarea breve antes de actuar.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {[
          "Notá la señal física de que algo se disparó",
          "Pausá: no actúes ni hables todavía",
          "Hacé una tarea mental durante 6 segundos",
          "Recién ahí, elegí cómo responder",
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: STATES.alta_carga.soft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: F, fontSize: 11.5, fontWeight: 600, color: THEME.ink }}>{i + 1}</div>
            <div style={{ fontFamily: F, fontSize: 13.5, color: THEME.ink, marginTop: 1 }}>{step}</div>
          </div>
        ))}
      </div>
      <PrimaryButton color={STATES.alta_carga.color} onClick={onStart}>Empezar</PrimaryButton>
    </div>
  );
}
function SixSecondTaskPicker({ onPick, onCancel }) {
  return (
    <div style={{ padding: "24px 20px" }}>
      <BackBtn onClick={onCancel} />
      <h2 style={{ fontFamily: D, fontSize: 19, color: THEME.ink, marginBottom: 14 }}>Elegí una tarea</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SIX_SECOND_TASKS.map((t) => (
          <button key={t.id} className="emo-btn" onClick={() => onPick(t)} style={{
            textAlign: "left", padding: "18px 20px", borderRadius: 24, border: `2px solid ${THEME.line}`,
            background: THEME.card, cursor: "pointer",
          }}>
            <div style={{ fontFamily: FN, fontWeight: 700, fontSize: 15, color: THEME.ink }}>{t.label}</div>
            <div style={{ fontFamily: F, fontSize: 12.5, color: THEME.ink, marginTop: 3 }}>{t.detail}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
function SixSecondTimer({ task, onFinish }) {
  const [remaining, setRemaining] = useState(6);
  useEffect(() => {
    hapticPulse();
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 0.1)), 100);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (remaining <= 0) onFinish(); }, [remaining]); // eslint-disable-line
  const pct = 1 - remaining / 6;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 20px" }}>
      <div style={{ fontFamily: D, fontSize: 17, color: THEME.ink, textAlign: "center", marginBottom: 6 }}>{task.label}</div>
      <p style={{ fontFamily: F, fontSize: 13, color: THEME.ink, textAlign: "center", marginBottom: 26, maxWidth: 260 }}>{task.detail}</p>
      <div style={{ position: "relative", width: 150, height: 150 }}>
        <svg width="150" height="150" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="75" cy="75" r="66" fill="none" stroke={`${STATES.alta_carga.color}33`} strokeWidth="9" />
          <circle cx="75" cy="75" r="66" fill="none" stroke={STATES.alta_carga.color} strokeWidth="9"
            strokeDasharray={2 * Math.PI * 66} strokeDashoffset={2 * Math.PI * 66 * (1 - pct)}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.1s linear" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: D, fontSize: 34, color: THEME.ink }}>
          {Math.ceil(remaining)}
        </div>
      </div>
    </div>
  );
}
function SixSecondClosing({ onDone }) {
  return (
    <div style={{ padding: "28px 20px", textAlign: "center", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
      <div style={{ width: 46, height: 46, borderRadius: "50%", background: STATES.alta_carga.soft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Zap size={22} color={STATES.alta_carga.color} />
      </div>
      <p style={{ fontFamily: D, fontSize: 18, color: THEME.ink, marginBottom: 8 }}>Reevaluá tu respuesta</p>
      <p style={{ fontFamily: F, fontSize: 13, color: THEME.ink, marginBottom: 26 }}>Antes de actuar, ¿te ayudó a frenar la reacción automática?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 260, margin: "0 auto" }}>
        <PrimaryButton color={STATES.alta_carga.color} onClick={() => onDone(true)}>Sí, frené a tiempo</PrimaryButton>
        <button className="emo-btn" onClick={() => onDone(false)} style={{
          background: "none", border: `1px solid ${THEME.line}`, borderRadius: 999, padding: "13px",
          fontFamily: F, fontSize: 14.5, color: THEME.ink, cursor: "pointer",
        }}>
          Todavía no
        </button>
      </div>
    </div>
  );
}
function SixSecondFlow({ onExit }) {
  const [step, setStep] = useState("intro");
  const [task, setTask] = useState(null);
  if (step === "intro") return <SixSecondIntro onCancel={onExit} onStart={() => setStep("pickTask")} />;
  if (step === "pickTask") return <SixSecondTaskPicker onCancel={() => setStep("intro")} onPick={(t) => { setTask(t); setStep("timer"); }} />;
  if (step === "timer") return <SixSecondTimer task={task} onFinish={() => setStep("closing")} />;
  if (step === "closing") return (
    <SixSecondClosing onDone={async (helped) => {
      const session = { id: uid(), timestamp: Date.now(), task: task.id, taskLabel: task.label, helped };
      const current = await loadSixSecondSessions();
      await saveSixSecondSessions([session, ...current]);
      onExit();
    }} />
  );
  return null;
}

/* ==================== NUEVO: Opción B — Diario Expresivo ==================== */
function DiarioExpresivo() {
  const [texto, setTexto] = useState("");
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    window.storage.get("emolab-diario-borrador", false)
      .then((r) => { if (r && r.value) setTexto(r.value); })
      .catch(() => {});
  }, []);

  const onChange = (val) => {
    setTexto(val);
    window.storage.set("emolab-diario-borrador", val, false).catch(() => {});
  };

  const guardar = async () => {
    if (!texto.trim()) return;
    const entry = { id: uid(), timestamp: Date.now(), texto: texto.trim() };
    // Guardado local primero (offline-first: nunca depende de tener internet)
    const current = await loadDiarioEntries();
    await saveDiarioEntries([entry, ...current]);
    // Sincroniza con Supabase (tabla `diario`); si falla, el registro ya quedó a salvo localmente
    saveDiarioRecord(entry).catch(() => {});
    await window.storage.set("emolab-diario-borrador", "", false).catch(() => {});
    setTexto("");
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2200);
  };

  const limpiar = () => {
    setTexto("");
    window.storage.set("emolab-diario-borrador", "", false).catch(() => {});
  };

  return (
    <div>
      <p style={{ fontFamily: F, fontSize: 13, color: THEME.inkSoft, marginBottom: 12, lineHeight: 1.4 }}>
        Escribí sin filtro, no hace falta que tenga sentido para nadie más que vos.
      </p>
      <div style={{ fontFamily: FN, fontWeight: 800, fontSize: 16, color: THEME.ink, marginBottom: 10 }}>¿Qué me pasa hoy?</div>
      <textarea
        value={texto}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Empezá a escribir acá..."
        rows={9}
        style={{
          width: "100%", boxSizing: "border-box", borderRadius: 20, border: `2px solid ${THEME.line}`,
          background: THEME.card, padding: "16px", fontFamily: F, fontSize: 14.5, color: THEME.ink,
          lineHeight: 1.5, resize: "vertical", outline: "none",
        }}
      />
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button className="emo-btn" onClick={limpiar} style={{
          flex: "0 0 auto", padding: "0 20px", borderRadius: 999, border: `2px solid ${THEME.line}`,
          background: "none", color: THEME.inkSoft, fontFamily: F, fontSize: 14, cursor: "pointer",
        }}>Limpiar</button>
        <div style={{ flex: 1 }}>
          <PrimaryButton disabled={!texto.trim()} onClick={guardar}>Guardar</PrimaryButton>
        </div>
      </div>
      {guardado && (
        <div style={{ marginTop: 12, textAlign: "center", fontFamily: F, fontSize: 13, color: THEME.regulado, fontWeight: 600 }}>
          Guardado ✓
        </div>
      )}
    </div>
  );
}

/* ==================== NUEVO: Opción C — Canvas de Dibujo ==================== */
const CANVAS_COLORS = ["#232D86", "#E4373D", "#2F6FD1", "#F4D03F", "#3DA35D", "#8B3FA0", "#FD9D62"];

function CanvasDibujo() {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [color, setColor] = useState(CANVAS_COLORS[0]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const p = e.touches && e.touches.length ? e.touches[0] : e;
    return { x: p.clientX - rect.left, y: p.clientY - rect.top };
  };
  const start = (e) => {
    drawingRef.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e) => {
    if (!drawingRef.current) return;
    if (e.cancelable) e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const end = () => { drawingRef.current = false; };
  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div>
      <p style={{ fontFamily: F, fontSize: 13, color: THEME.inkSoft, marginBottom: 12, lineHeight: 1.4 }}>
        Dejá que la mano se mueva libre. No hace falta que "quede bien" — es un garabato regulador, no una obra.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {CANVAS_COLORS.map((c) => (
          <button key={c} onClick={() => setColor(c)} aria-label={c} style={{
            width: 30, height: 30, borderRadius: "50%", background: c, cursor: "pointer",
            border: color === c ? "3px solid #1A1A1A" : "2px solid #fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }} />
        ))}
      </div>
      <canvas
        ref={canvasRef}
        width={320}
        height={360}
        style={{ width: "100%", maxWidth: 320, height: 360, background: "#fff", borderRadius: 20, border: `1px solid ${THEME.line}`, touchAction: "none", display: "block", margin: "0 auto" }}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}
      />
      <button className="emo-btn" onClick={clear} style={{
        marginTop: 14, width: "100%", background: "none", border: `1px solid ${THEME.line}`, borderRadius: 999,
        padding: "13px", fontFamily: F, fontSize: 14, color: THEME.ink, cursor: "pointer",
      }}>
        Limpiar trazo
      </button>
    </div>
  );
}

/* ==================== Vista principal de Rescate ==================== */
export default function Rescate() {
  const [mode, setMode] = useState("cuerpo"); // cuerpo | diario | dibujo
  const [active, setActive] = useState(null);
  const [view, setView] = useState("home"); // home | pickTechnique | pickDuration | session | closing | sixSecond
  const [technique, setTechnique] = useState(null);
  const [duration, setDuration] = useState(null);

  if (active) {
    return (
      <ExercisePlayer
        exercise={{ ...active, intent: "Regulación inmediata" }}
        accent={STATES[active.state].color}
        onCancel={() => setActive(null)}
        onFinish={() => setActive(null)}
      />
    );
  }

  if (view === "pickTechnique") return (
    <div style={{ padding: "24px 20px" }}>
      <BackBtn onClick={() => setView("home")} />
      <h2 style={{ fontFamily: D, fontSize: 19, color: THEME.ink, marginBottom: 14 }}>Elegí una técnica</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {BREATHING_TECHNIQUES.map((t) => (
          <button key={t.id} className="emo-btn" onClick={() => { setTechnique(t); setView("pickDuration"); }} style={{
            textAlign: "left", padding: "18px 20px", borderRadius: 24, border: `2px solid ${THEME.line}`,
            background: THEME.card, cursor: "pointer",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: FN, fontWeight: 700, fontSize: 15, color: THEME.ink }}>{t.title}</span>
              <span style={{ fontFamily: F, fontSize: 12, color: THEME.ink, fontWeight: 600 }}>{t.subtitle}</span>
            </div>
            <div style={{ fontFamily: F, fontSize: 12.5, color: THEME.ink, marginTop: 4 }}>{t.intent}</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (view === "pickDuration") return (
    <div style={{ padding: "24px 20px" }}>
      <BackBtn onClick={() => setView("pickTechnique")} />
      <h2 style={{ fontFamily: D, fontSize: 19, color: THEME.ink, marginBottom: 14 }}>¿Cuánto tiempo tenés?</h2>
      <div style={{ display: "flex", gap: 10 }}>
        {BREATHING_DURATIONS.map((d) => (
          <button key={d} className="emo-btn" onClick={() => { setDuration(d); setView("session"); }} style={{
            flex: 1, padding: "20px 0", borderRadius: 24, border: `2px solid ${THEME.line}`,
            background: THEME.card, cursor: "pointer", textAlign: "center",
          }}>
            <div style={{ fontFamily: FN, fontWeight: 700, fontSize: 22, color: THEME.ink }}>{d / 60}</div>
            <div style={{ fontFamily: F, fontSize: 11.5, color: THEME.ink }}>min</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (view === "session") return (
    <BreathingSession technique={technique} totalSeconds={duration} onCancel={() => setView("home")} onFinish={() => setView("closing")} />
  );

  if (view === "closing") return (
    <BreathingClosing onDone={async (feltBetter) => {
      const session = { id: uid(), timestamp: Date.now(), technique: technique.id, techniqueLabel: technique.title, durationSeconds: duration, feltBetter };
      const current = await loadBreathingSessions();
      await saveBreathingSessions([session, ...current]);
      setView("home");
    }} />
  );

  if (view === "sixSecond") return <SixSecondFlow onExit={() => setView("home")} />;

  /* ---------- Home: título + selector de 3 vías + contenido según el modo ---------- */
  return (
    <div style={{ padding: "0 20px 8px", background: "#FFF9EB", boxSizing: "border-box" }}>
      <h2 style={VIEW_TITLE_STYLE}>Botón de rescate</h2>
      <p style={{ ...VIEW_SUBTITLE_STYLE, marginBottom: 18 }}>
        Elegí cómo querés regularte ahora: con el cuerpo, escribiendo, o dibujando.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 22, background: "#00000008", borderRadius: 999, padding: 4 }}>
        {[
          { id: "cuerpo", label: "Cuerpo", icon: Wind },
          { id: "diario", label: "Diario", icon: PenLine },
          { id: "dibujo", label: "Dibujo", icon: Palette },
        ].map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button key={m.id} className="emo-btn" onClick={() => setMode(m.id)} style={{
              flex: 1, padding: "10px 0", borderRadius: 999, border: "none",
              background: isActive ? "#fff" : "transparent",
              boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer",
            }}>
              <Icon size={16} color={isActive ? THEME.ink : THEME.inkSoft} />
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: isActive ? 700 : 400, color: isActive ? THEME.ink : THEME.inkSoft }}>{m.label}</span>
            </button>
          );
        })}
      </div>

      {mode === "diario" && <DiarioExpresivo />}
      {mode === "dibujo" && <CanvasDibujo />}

      {mode === "cuerpo" && (
        <>
          <div style={{ fontFamily: F, fontSize: 11, fontWeight: 400, letterSpacing: 0.5, textTransform: "uppercase", color: THEME.inkSoft, marginBottom: 10 }}>Empezá por acá</div>

          <button className="emo-btn" onClick={() => setView("pickTechnique")} style={{
            display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left",
            padding: "18px 22px", borderRadius: 999, border: "none", background: THEME.celesteSoft,
            marginBottom: 12, boxSizing: "border-box", cursor: "pointer",
          }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: THEME.celeste, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Wind size={21} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FN, fontWeight: 800, fontSize: 16, color: THEME.ink }}>Respiración guiada</div>
              <div style={{ fontFamily: F, fontSize: 12.5, color: THEME.inkSoft, marginTop: 2 }}>3 técnicas · 1, 3 o 5 minutos</div>
            </div>
            <ChevronLeft size={18} color={THEME.celeste} style={{ transform: "rotate(180deg)", flexShrink: 0 }} />
          </button>

          <button className="emo-btn" onClick={() => setView("sixSecond")} style={{
            display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left",
            padding: "18px 22px", borderRadius: 999, border: "none", background: THEME.reguladoSoft,
            marginBottom: 24, boxSizing: "border-box", cursor: "pointer",
          }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: THEME.regulado, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Zap size={20} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FN, fontWeight: 800, fontSize: 16, color: THEME.ink }}>Pausa de 6 segundos</div>
              <div style={{ fontFamily: F, fontSize: 12.5, color: THEME.inkSoft, marginTop: 2 }}>Para frenar antes de reaccionar</div>
            </div>
            <ChevronLeft size={18} color={THEME.regulado} style={{ transform: "rotate(180deg)", flexShrink: 0 }} />
          </button>

          <div style={{ fontFamily: F, fontSize: 11, fontWeight: 400, letterSpacing: 0.5, textTransform: "uppercase", color: THEME.inkSoft, marginBottom: 10 }}>O elegí según lo que sentís</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingBottom: 20 }}>
            {RESCATE_OPTIONS.map((r) => (
              <button key={r.id} className="emo-btn" onClick={() => setActive(r)} style={{
                textAlign: "left", padding: "20px 18px", minHeight: 118, display: "flex", flexDirection: "column",
                justifyContent: "center", borderRadius: 26, border: "none", background: STATES[r.state].soft,
                boxSizing: "border-box", cursor: "pointer", fontFamily: F,
              }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: STATES[r.state].color, marginBottom: 10 }} />
                <div style={{ fontFamily: FN, fontWeight: 800, fontSize: 15, color: THEME.ink, lineHeight: 1.25 }}>{r.label}</div>
                <div style={{ fontSize: 12, color: THEME.inkSoft, marginTop: 5 }}>{r.duration}s guiados</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
