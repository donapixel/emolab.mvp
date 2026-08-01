/* ---------- data/constants.js ----------
   Estructuras de datos compartidas entre vistas: estados del sistema nervioso,
   emociones primarias/complejas, zonas del cuerpo, ejercicios y rutas de assets.
   No contiene JSX ni lógica de componentes — solo datos e íconos de lucide-react. */

import {
  Wind, Anchor, Zap, MessageCircle, Sparkles,
  LifeBuoy, BookOpen, Home as HomeIcon, User,
} from "lucide-react";
import { THEME } from "../theme";

/* ---------- Assets (imágenes locales, rutas relativas a la carpeta assets/) ---------- */
export const LOGO_ICON = "assets/logo.png";
export const BODY_FIGURE = "assets/cuerpo.png";
export const EMO_ENOJO_IMG = "assets/emocionenojo.png";
export const EMO_ALEGRIA_IMG = "assets/emocionalegria.png";
export const EMO_ASCO_IMG = "assets/emocionasco.png";
export const EMO_MIEDO_IMG = "assets/emocionmiedo.png";
export const EMO_SORPRESA_IMG = "assets/emocionsorpresa.png";
export const EMO_TRISTEZA_IMG = "assets/emociontristeza.png";
export const AVATAR_MUJER_IMG = "assets/mujerperfil.png";
export const AVATAR_HOMBRE_IMG = "assets/hombreperfil.png";
export const PISTA_JUEGO_IMG = "assets/pistajuego.png"; // supuse extensión .png, avisame si es otra

/* Nube Emocional: cuando tengamos los PNG recortados, completar estas rutas.
   EmotionCloudVisual.jsx detecta que dejaron de ser null y arma las capas solo. */
export const NUBE_BASE_IMG = null; // ej: "assets/nube-base.png"
export const NUBE_LAYER_IMG = {
  ira: null,       // ej: "assets/nube-enojo.png"
  tristeza: null,  // ej: "assets/nube-tristeza.png"
  alegria: null,   // ej: "assets/nube-alegria.png"
  miedo: null,     // ej: "assets/nube-miedo.png"
  asco: null,      // ej: "assets/nube-asco.png"
  sorpresa: null,  // ej: "assets/nube-sorpresa.png"
};

/* Colores del placeholder de la Nube (mientras no hay imágenes) */
export const CLOUD_EMOTION_COLORS = {
  ira: "#E4373D",       // Enojo: rojo
  tristeza: "#2F6FD1",
  alegria: "#F5B942",
  miedo: "#8B3FA0",
  asco: "#3DA35D",
  sorpresa: "#F0932B",  // Sorpresa: naranja (antes celeste)
};
export const CLOUD_NEUTRAL = "#C9C2B0";

/* ---------- Autoevaluación de Inteligencia Emocional (Mi Perfil) ---------- */
export const IE_BRANCHES = {
  percepcion: { label: "Percepción y expresión", color: "#F8488A" },
  facilitacion: { label: "Facilitación del pensamiento", color: "#FFAE5C" },
  comprension: { label: "Comprensión emocional", color: "#6CCF99" },
  regulacion: { label: "Regulación reflexiva", color: "#3FA9C9" },
};
export const IE_ITEMS = [
  { id: "p1", branch: "percepcion", text: "Puedo identificar con claridad qué emoción estoy sintiendo apenas aparece." },
  { id: "p2", branch: "percepcion", text: "Puedo notar en el rostro o la voz de otra persona qué está sintiendo, aunque no lo diga." },
  { id: "f1", branch: "facilitacion", text: "Cuando estoy de buen humor, se me ocurren ideas nuevas con más facilidad." },
  { id: "f2", branch: "facilitacion", text: "Sé aprovechar cierta activación o urgencia para concentrarme mejor en una tarea." },
  { id: "c1", branch: "comprension", text: "Entiendo por qué una emoción se transforma en otra (por ejemplo, de enojo a alivio)." },
  { id: "c2", branch: "comprension", text: "Puedo reconocer cuando siento dos emociones contradictorias al mismo tiempo." },
  { id: "r1", branch: "regulacion", text: "Cuando una emoción es muy intensa, puedo bajarle la intensidad sin reprimirla del todo." },
  { id: "r2", branch: "regulacion", text: "Puedo acompañar una emoción difícil sin que me desborde ni la evite." },
];

/* ---------- Estados del sistema nervioso (modelo polivagal) ---------- */
export const STATES = {
  alta_carga: { label: "Alta Carga", color: THEME.altaCarga, soft: THEME.altaCargaSoft, icon: Zap },
  colapso: { label: "Colapso", color: THEME.colapso, soft: THEME.colapsoSoft, icon: Anchor },
  bloqueo: { label: "Bloqueo", color: THEME.bloqueo, soft: THEME.bloqueoSoft, icon: Wind },
  regulado: { label: "Regulado", color: THEME.regulado, soft: THEME.reguladoSoft, icon: Sparkles },
  sin_clasificar: { label: "Sin clasificar", color: THEME.neutro, soft: THEME.neutroSoft, icon: MessageCircle },
};

/* ---------- Check-in: mapa corporal ---------- */
export const ZONES = [
  { id: "cabeza", label: "Cabeza", top: 15, left: 50 },
  { id: "frente", label: "Frente", top: 22, left: 50 },
  { id: "garganta", label: "Garganta", top: 32, left: 50 },
  { id: "pecho", label: "Pecho", top: 44, left: 50 },
  { id: "estomago", label: "Estómago", top: 52, left: 50 },
  { id: "mano_izq", label: "Mano izquierda", top: 53, left: 38 },
  { id: "mano_der", label: "Mano derecha", top: 53, left: 62 },
  { id: "genital", label: "Genital", top: 60, left: 50 },
  { id: "rodillas", label: "Rodillas", top: 72, left: 50 },
  { id: "pie_izq", label: "Pie izquierdo", top: 88, left: 47 },
  { id: "pie_der", label: "Pie derecho", top: 88, left: 53 },
];

export const SENSATIONS = ["Opresión", "Nudo", "Fuego / Calor", "Vacío", "Peso", "Agitación"];

export const SURFACE_EMOTIONS = [
  { id: "enojo", label: "Enojo / Bronca", state: "alta_carga",
    deepen: "El enojo suele proteger algo valioso. Debajo de esta bronca, ¿sentís que se traspasó un límite, o hay también desilusión o dolor?",
    granular: ["Fastidio / Molestia", "Frustración", "Exasperación", "Amargura / Resentimiento"] },
  { id: "ansiedad", label: "Ansiedad / Rumiación", state: "alta_carga",
    deepen: "La ansiedad intenta resolver el futuro. Si traemos el foco al presente, ¿hay alguna tristeza no llorada o alguna decisión postergada dando vueltas?",
    granular: ["Inquietud / Trepidación", "Nerviosismo", "Ansiedad", "Temor / Pavor anticipatorio"] },
  { id: "angustia", label: "Angustia / Peso", state: "colapso",
    deepen: "La angustia nos pide pausa. ¿Sentís que estás sosteniendo demasiado en soledad, o que necesitás procesar una pérdida?",
    granular: ["Impotencia / Indefensión", "Desesperanza", "Duelo / Pesar profundo", "Angustia"] },
  { id: "tristeza", label: "Tristeza", state: "colapso",
    deepen: "La tristeza marca que algo se perdió o que necesitás soltar. ¿Qué es lo que sentís que ya no está, o qué te gustaría dejar ir?",
    granular: ["Decepción / Desilusión", "Desánimo / Desaliento", "Consternación / Desasosiego", "Resignación"] },
  { id: "miedo", label: "Miedo / Desconexión", state: "bloqueo",
    deepen: "El miedo busca protegerte de un peligro. ¿Sentís que necesitás más información, más apoyo, o simplemente más tiempo?",
    granular: ["Desesperación", "Pánico", "Horror", "Terror"] },
  { id: "asco", label: "Asco / Rechazo", state: "bloqueo",
    deepen: "El asco marca que algo se siente dañino o incompatible con tus valores. ¿Qué es exactamente lo que tu cuerpo quiere alejar?",
    granular: ["Repulsión", "Indignación", "Desconfianza", "Hartazgo"] },
  { id: "verguenza_culpa", label: "Vergüenza / Culpa", state: "bloqueo",
    deepen: "La vergüenza teme el rechazo si otros ven lo que pensás o hiciste; la culpa se arrepiente de una acción pasada e impulsa a repararla. ¿Cuál de las dos se siente más presente ahora?",
    granular: ["Vergüenza ajena / Embarazo", "Vergüenza (Shame)", "Culpa", "Autocrítica"] },
  { id: "alegria", label: "Alegría / Bienestar", state: "regulado",
    deepen: "La alegría marca que algo valioso se logró o está a salvo. ¿Qué fue lo que hizo que este momento se sintiera así?",
    granular: ["Placer", "Alivio", "Paz / Tranquilidad", "Entusiasmo / Excitación"] },
  { id: "sorpresa", label: "Sorpresa / Asombro", state: "regulado",
    deepen: "La sorpresa abre la atención ante lo inesperado. ¿Qué esperabas que pasara, y qué se rompió respecto a eso?",
    granular: ["Curiosidad", "Desconcierto", "Entusiasmo", "Alerta"] },
  { id: "otra", label: "Otra / No sé bien qué siento", state: null,
    deepen: "Contame con tus palabras qué es lo que sentís, sin buscar la palabra exacta.",
    granular: [] },
];

export const NECESIDADES = ["Límite", "Descarga", "Sostén / Pausa", "Claridad", "Expresarlo"];

/* ---------- Rescate: ejercicios guiados por estado del sistema nervioso ---------- */
export const EXERCISES_BY_STATE = {
  alta_carga: [
    { id: "empuje", title: "Empuje de contención", duration: 20, mode: "hold",
      steps: ["Apoyá las palmas contra una pared firme", "Empujá con fuerza de brazos y piernas mientras exhalás por la boca", "Sostené la fuerza unos segundos más"],
      intent: "Restablece la sensación de límite y potencia personal." },
    { id: "sacudida", title: "Sacudida activa", duration: 60, mode: "shake",
      steps: ["Destrabá las rodillas", "Sacudí manos, brazos y piernas con energía", "Dejá que el movimiento sea desprolijo, sin coreografía"],
      intent: "Libera el exceso de adrenalina del sistema nervioso simpático." },
    { id: "tension", title: "Tensión-relajación diferencial", duration: 45, mode: "steps",
      steps: ["Cerrá los puños y tensá los hombros con fuerza", "Sostené la tensión unos segundos", "Soltá de golpe con un suspiro audible"],
      intent: "Completa el ciclo de activación biológica de forma segura." },
  ],
  colapso: [
    { id: "autocontencion", title: "Autocontención somática", duration: 120, mode: "steps",
      steps: ["Una mano en el centro del pecho", "La otra en el abdomen o bajo la axila opuesta", "Sentí el peso y el calor de tus propias manos"],
      intent: "Devuelve una sensación de seguridad y sostén." },
    { id: "apertura_pecho", title: "Apertura de pecho apoyada", duration: 60, mode: "steps",
      steps: ["Sentate bien atrás en la silla", "Entrelazá las manos detrás de la nuca", "Dejá caer la cabeza suavemente hacia atrás, inhalando hacia el pecho"],
      intent: "Activa muy suavemente el tono muscular sin sobrecargar el sistema." },
    { id: "contacto_tierra", title: "Contacto con la tierra", duration: 60, mode: "steps",
      steps: ["Apoyá bien los pies en el piso", "Presioná los talones conscientemente", "Masajeá los muslos hacia abajo, bajando el foco de la cabeza al cuerpo"],
      intent: "Enraizamiento: baja el foco de la mente al cuerpo." },
  ],
  bloqueo: [
    { id: "orientacion", title: "Orientación espacial", duration: 60, mode: "steps",
      steps: ["Movés cabeza y ojos muy despacio hacia la derecha", "Ahora hacia la izquierda", "Nombrá mentalmente 3 objetos neutros que ves"],
      intent: "Le indica al cerebro primitivo que no hay peligro inminente." },
    { id: "costillas", title: "Respiración de costillas", duration: 60, mode: "breathing",
      steps: ["Manos en los costados de la caja torácica", "Inhalá buscando separar las manos hacia los lados", "Soltá el aire despacio"],
      intent: "Gana espacio interno cuando el cuerpo se siente rígido." },
    { id: "mandibula", title: "Apertura de mandíbula", duration: 45, mode: "steps",
      steps: ["Abrí la boca suavemente", "Movés la mandíbula de lado a lado", "Emití un sonido grave, un 'Mmm' sostenido"],
      intent: "Estimula el nervio vago y libera tensión del cuello." },
  ],
  regulado: [
    { id: "saboreo", title: "Saboreo consciente", duration: 30, mode: "steps",
      steps: ["Notá dónde en el cuerpo sentís esta sensación agradable", "Quedate ahí unos segundos más, sin apurarte", "Poné una palabra a lo que estás sintiendo"],
      intent: "Ayuda al cuerpo a grabar y sostener el bienestar, no solo lo difícil." },
  ],
};

/* Rescate: combos rápidos de 1 toque */
export const RESCATE_OPTIONS = [
  { id: "bronca", label: "Bronca / Alta Carga", state: "alta_carga", duration: 60,
    steps: ["Empujá las palmas contra una pared firme, con fuerza", "Exhalá fuerte por la boca mientras empujás", "Soltá y sacudí brazos y manos unos segundos"] },
  { id: "ansiedad_acel", label: "Ansiedad / Aceleración", state: "bloqueo", duration: 60,
    steps: ["Nombrá 3 objetos que ves a tu alrededor", "Nombrá 2 sonidos que escuchás", "Soltá el aire en una exhalación larga y lenta"] },
  { id: "angustia_col", label: "Angustia / Colapso", state: "colapso", duration: 90,
    steps: ["Una mano en el pecho, otra en el abdomen", "Sentí el peso de tus manos", "Presioná los pies contra el piso"] },
  { id: "miedo_desc", label: "Miedo / Desconexión", state: "bloqueo", duration: 60,
    steps: ["Movés la mirada despacio de un lado a otro del espacio", "Abrí la boca suavemente y movés la mandíbula", "Emití un 'Mmm' grave y sostenido"] },
  { id: "verguenza_culpa", label: "Vergüenza / Culpa", state: "bloqueo", duration: 60,
    steps: ["Una mano en el pecho, reconocé lo que sentís sin pelearlo", "Recordá: sentir vergüenza o culpa no te define como persona", "Pensá en una frase amable que le dirías a un amigo en tu lugar"] },
];

export const BREATHING_TECHNIQUES = [
  { id: "cuadrada", title: "Respiración Cuadrada", subtitle: "4-4-4-4",
    intent: "Reduce el estrés agudo y ayuda a recuperar el foco.",
    phases: [
      { label: "Inhalá", seconds: 4, mode: "in" }, { label: "Sostené", seconds: 4, mode: "hold" },
      { label: "Exhalá", seconds: 4, mode: "out" }, { label: "Sostené", seconds: 4, mode: "hold" },
    ] },
  { id: "478", title: "Técnica 4-7-8", subtitle: "Relajación profunda",
    intent: "Desactiva el sistema nervioso simpático. Ideal para ansiedad o insomnio.",
    phases: [
      { label: "Inhalá", seconds: 4, mode: "in" }, { label: "Sostené", seconds: 7, mode: "hold" },
      { label: "Exhalá", seconds: 8, mode: "out" },
    ] },
  { id: "coherencia", title: "Coherencia Cardíaca", subtitle: "5-5",
    intent: "Ritmo fluido que alinea respiración y corazón. Para abrumamiento moderado.",
    phases: [{ label: "Inhalá", seconds: 5, mode: "in" }, { label: "Exhalá", seconds: 5, mode: "out" }] },
];
export const BREATHING_DURATIONS = [60, 180, 300]; // 1, 3, 5 minutos

export const SIX_SECOND_TASKS = [
  { id: "contar", label: "Contar para atrás de 7 en 7", detail: "Empezá en 100: 100, 93, 86, 79..." },
  { id: "azul", label: "Nombrar 3 objetos azules", detail: "Mirá a tu alrededor y buscalos, uno por uno." },
  { id: "calculo", label: "Resolver un cálculo simple", detail: "Por ejemplo: 17 + 25, o 9 x 6." },
];

/* ---------- Las 5 emociones universales + Sorpresa (Atlas de Emociones) ---------- */
export const PRIMARY_ORDER = ["ira", "alegria", "sorpresa", "tristeza", "asco", "miedo"];

export const PRIMARY_EMOTIONS = {
  ira: {
    label: "Enojo", color: "#E4373D", image: EMO_ENOJO_IMG,
    trigger: "Surge cuando algo nos frena/bloquea o cuando percibimos que nos tratan de manera injusta.",
    physicalSigns: ["Mirada fija/desafiante (ojos entrecerrados)", "Cejas bajadas y fruncidas", "Labios estrechados y apretados", "Voz: rugido (si no se controla) o tono afilado y cortante"],
    bodySensations: "Sensación de calor en la cara, tensión en la mandíbula, los hombros o el pecho.",
    message: "Quítate de mi camino (varía desde insatisfacción hasta amenaza).",
    mood: "Irritabilidad (predisposición a enfadarse fácilmente).",
    trait: "Hostilidad.",
    actionsIntrinsic: ["Discutir", "Insultar", "Sabotear", "Gritar", "Usar fuerza física", "Rumiar bronca", "Comportamiento pasivo-agresivo"],
    actionsRegulation: ["Establecer límites", "Mantenerse firme", "Retirarse", "Tomarse un tiempo fuera", "Respirar", "Practicar la paciencia", "Reencuadrar el pensamiento"],
    texto: "Surge cuando algo nos frena o cuando percibimos que nos tratan de manera injusta. Debajo casi siempre hay algo que necesita ser protegido.",
    derivados: ["Fastidio / Molestia", "Frustración", "Exasperación", "Beligerancia", "Amargura / Resentimiento", "Deseo de venganza / Rencor", "Furia / Ira desmedida"],
  },
  miedo: {
    label: "Miedo", color: "#8B3FA0", image: EMO_MIEDO_IMG,
    trigger: "Anticipación de amenazas a la seguridad o peligro.",
    physicalSigns: ["Ojos muy abiertos", "Cejas levantadas y unidas", "Labios estirados horizontalmente", "Músculos del cuello tensos, cabeza echada hacia atrás/alejándose", "Respiración pesada o gritos en momentos intensos"],
    bodySensations: "Aceleración cardíaca, sudoración, temblor, tensión muscular generalizada, hipervigilancia a amenazas.",
    message: "Ayúdame (varía desde baja preocupación hasta pánico).",
    mood: "Aprehensión (ansiedad o sensación de estar al límite).",
    trait: "Timidez o introversión temerosa.",
    actionsIntrinsic: ["Retirarse", "Evitar", "Dudar", "Congelarse (bloqueo)", "Gritar", "Rumiar", "Preocuparse"],
    actionsRegulation: ["Reencuadrar", "Atención plena (mindfulness)", "Respiración consciente", "Distracción"],
    texto: "Te avisa de un peligro real o percibido y prepara al cuerpo para protegerse, ya sea huyendo, paralizándose o buscando ayuda.",
    derivados: ["Inquietud / Trepidación", "Nerviosismo", "Ansiedad", "Temor / Pavor anticipatorio", "Desesperación", "Pánico", "Horror", "Terror"],
  },
  sorpresa: {
    label: "Sorpresa", color: "#F0932B", image: EMO_SORPRESA_IMG,
    trigger: "Respuesta rápida ante un evento inesperado.",
    physicalSigns: ["Cejas levantadas", "Ojos bien abiertos", "Boca ligeramente abierta"],
    bodySensations: "Es la emoción más breve de todas: un instante de atención abierta antes de decidir qué sentir después.",
    message: "¿Qué fue eso? (funciona como un signo de interrogación que el cuerpo pone antes de decidir qué sentir).",
    mood: "Alerta / desconcierto pasajero.",
    trait: "Curiosidad.",
    actionsIntrinsic: ["Detenerse en seco", "Contener la respiración", "Exclamar"],
    actionsRegulation: ["Orientarse", "Nombrar lo que cambió", "Respirar y observar"],
    texto: "Es la más breve de todas las emociones: aparece ante lo inesperado y abre por un instante la atención. Según el Atlas de Emociones no es una emoción universal en sí misma, sino un puente hacia cualquier otra emoción (ira, miedo, alegría, etc.), según hacia dónde se resuelva.",
    derivados: ["Interesado", "Sorprendido", "Confundido", "Asombrado", "Efusivo", "Jubiloso"],
  },
  alegria: {
    label: "Disfrute / Alegría", color: "#F4D03F", image: EMO_ALEGRIA_IMG,
    trigger: "Experiencia de bienestar, placer, conexión o alivio.",
    physicalSigns: ["Sonrisa Duchenne (auténtica): elevación de las comisuras de los labios y contracción de los músculos alrededor de los ojos (patas de gallo)", "Tono vocal: suspiros de alivio, risas, carcajadas, risitas"],
    bodySensations: "Relajación muscular, calidez en el pecho, sensación de ligereza o energía positiva.",
    message: "Esto se siente bien (promueve la interacción social).",
    mood: "Eufórico / Elated (sensación generalizada de bienestar).",
    trait: "Alegre, optimista.",
    actionsIntrinsic: ["Buscar más de la experiencia", "Mantener la actividad", "Exclamar", "Conectar con otros", "Saborear", "Deleitarse"],
    actionsRegulation: ["Generalmente no requiere regulación restrictiva, sino facilitación."],
    texto: "Marca que algo valioso se logró, se compartió o está a salvo. Invita a acercarte a las personas y situaciones que la generaron.",
    derivados: ["Placer (sensorial)", "Regocijo", "Alegría compasiva", "Diversión / Entretenimiento", "Regodeo", "Alivio", "Paz / Tranquilidad", "Orgullo / Triunfo", "Orgullo hacia los logros de allegados", "Asombro / Maravilla", "Entusiasmo / Excitación", "Éxtasis"],
  },
  tristeza: {
    label: "Tristeza", color: "#2F6FD1", image: EMO_TRISTEZA_IMG,
    trigger: "Respuesta ante una pérdida significativa, decepción o impotencia.",
    physicalSigns: ["Comisuras de los labios hacia abajo (ceño fruncido)", "Extremos internos de las cejas elevados y unidos en el centro de la frente", "Mejillas ligeramente elevadas, lágrimas", "Voz: sollozos, voz temblorosa o entrecortada"],
    bodySensations: "Sensación de pesadez en el pecho, nudo en la garganta, falta de energía, letargo.",
    message: "Consuélame (fomenta la empatía y conexión con los demás).",
    mood: "Disfórico / Acongojado (desaliento duradero).",
    trait: "Sombrío, melancólico o propenso al desánimo.",
    actionsIntrinsic: ["Buscar consuelo", "Aislarse / retirarse", "Guardar luto", "Protestar", "Sentir vergüenza"],
    actionsRegulation: ["Retirarse para procesar", "Distracción positiva"],
    texto: "Marca una pérdida o una necesidad no satisfecha, y baja naturalmente el ritmo del cuerpo. Suele convocar el sostén y el acompañamiento de otras personas.",
    derivados: ["Decepción / Desilusión", "Desánimo / Desaliento", "Consternación / Desasosiego", "Resignación", "Impotencia / Indefensión", "Desesperanza", "Desdicha / Miseria emocional", "Desesperación", "Duelo / Pesar profundo", "Pesadumbre", "Angustia"],
  },
  asco: {
    label: "Asco / Disgusto", color: "#3DA35D", image: EMO_ASCO_IMG,
    trigger: "Rechazo ante algo o alguien percibido como sucio, tóxico, inmoral o indeseable.",
    physicalSigns: ["Arrugar la nariz y elevar las fosas nasales", "Sacar la lengua (como intentando expulsar algo de la boca)", "Elevar el labio superior (enseñando dientes o encías de forma relajada)"],
    bodySensations: "Náuseas, revulsión estomacal, deseo de alejamiento físico inmediato.",
    message: "Aléjate de esto (indica suciedad, repulsión o rechazo social/moral).",
    mood: "Amargado / \"Agrio\" (sentimiento general de repulsión).",
    trait: "Hipercrítico, despectivo o con aversión extrema hacia los demás.",
    actionsIntrinsic: ["Retirarse", "Evitar", "Vomitar", "Deshumanizar"],
    actionsRegulation: ["Alejarse deliberadamente", "Marcar distancia de forma consciente"],
    texto: "Marca rechazo hacia algo que el cuerpo o la mente sienten dañino, contaminante o incompatible con los propios valores, y genera el impulso de alejarse.",
    derivados: ["Crítico", "Desaprobado", "Decepcionado", "Terrible", "Evasivo", "Culpable"],
  },
};

/* Estados emocionales complejos (combinaciones de las emociones universales) */
export const COMPLEX_EMOTIONS = [
  { label: "Amor", description: "Afecto y apego profundo hacia una persona (hijos, pareja).", involved: ["Ira", "Miedo", "Tristeza", "Asco", "Disfrute"] },
  { label: "Sorpresa", description: "La emoción más breve; respuesta rápida ante un evento inesperado. Sirve como puente hacia cualquier otra emoción.", involved: [] },
  { label: "Celos", description: "Triángulo emocional: uno mismo, la persona deseada y un rival.", involved: ["Ira", "Miedo", "Asco", "Tristeza", "Sorpresa"] },
  { label: "Envidia", description: "Resentimiento por lo que otra persona posee.", involved: ["Ira", "Desprecio", "Tristeza"] },
  { label: "Odio", description: "Ira sostenida y duradera dirigida a una persona o grupo.", involved: ["Ira prolongada"] },
  { label: "Vergüenza ajena / Embarazo", description: "Incomodidad o angustia por autoconciencia o error social (puede provocar rubor).", involved: ["Miedo", "Tristeza"] },
  { label: "Vergüenza (Shame)", description: "Temor a que otros sientan asco o rechazo si descubren lo que uno piensa o hizo.", involved: ["Miedo", "Asco"] },
  { label: "Desprecio", description: "Sentimiento de superioridad moral hacia otra persona.", involved: ["Asco", "Disfrute"] },
  { label: "Culpa", description: "Arrepentimiento por una acción pasada; impulsa la confesión.", involved: ["Tristeza", "Miedo"] },
];

/* Conecta la emoción de superficie del check-in (por id) con su primaria más cercana, para el mapa semanal */
export const SURFACE_TO_PRIMARY = {
  enojo: "ira", ansiedad: "miedo", angustia: "tristeza", tristeza: "tristeza", miedo: "miedo",
  asco: "asco", alegria: "alegria", sorpresa: "sorpresa", verguenza_culpa: "tristeza",
};

/* ---------- Navegación inferior (Navbar.jsx la consume) ---------- */
export const TABS = [
  { id: "checkin", label: "Check-in", icon: HomeIcon },
  { id: "rescate", label: "Rescate", icon: LifeBuoy },
  { id: "sesion", label: "Mi Perfil", icon: User },
  { id: "glosario", label: "Glosario y juegos", icon: BookOpen },
];
