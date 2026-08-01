/* ---------- src/lib/supabaseClient.js ----------
   Cliente de Supabase + helpers de guardado para las tablas `checkins` y `diario`.
   Requiere estas variables de entorno (archivo .env.local en local, y
   Vercel > Settings > Environment Variables en producción):
     VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
     VITE_SUPABASE_ANON_KEY=tu-anon-key

   Esquema de tablas esperado en Supabase (ajustalo si tu esquema es distinto):

   checkins
     id            uuid        default gen_random_uuid() primary key
     user_id       uuid        references auth.users (nullable si todavía no hay login)
     surface_emotion  text
     state         text
     sensation     text
     granular      text
     necesidad     text
     zones         text[]
     deepen_text   text
     flagged       boolean     default false
     created_at    timestamptz default now()

   diario
     id            uuid        default gen_random_uuid() primary key
     user_id       uuid        references auth.users (nullable si todavía no hay login)
     texto         text
     created_at    timestamptz default now() */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabaseClient] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. " +
    "Agregalas a tu .env.local (y en Vercel > Settings > Environment Variables) " +
    "o los guardados a Supabase van a fallar silenciosamente."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ---------- Autenticación (base mínima, lista para ampliar) ---------- */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data?.user ?? null;
}

/* ---------- Check-in: inserta un registro en la tabla `checkins` ----------
   `entry` es el objeto de check-in tal como ya lo arma el flujo de Check-in
   (surfaceEmotion, state, sensation, granular, necesidad, zones, deepenText, flagged).
   Devuelve true/false según si se guardó bien; nunca tira una excepción hacia
   arriba, para que un fallo de red no rompa el guardado local (offline-first). */
export async function saveCheckinRecord(entry) {
  const user = await getCurrentUser();
  const { error } = await supabase.from("checkins").insert([{
    user_id: user?.id ?? null,
    surface_emotion: entry.surfaceEmotion ?? null,
    state: entry.state ?? null,
    sensation: Array.isArray(entry.sensation) ? entry.sensation.join(", ") : (entry.sensation ?? null),
    granular: entry.granular ?? null,
    necesidad: entry.necesidad ?? null,
    zones: entry.zones ?? null,
    deepen_text: entry.deepenText ?? null,
    flagged: !!entry.flagged,
    created_at: new Date(entry.timestamp || Date.now()).toISOString(),
  }]);
  if (error) {
    console.error("[Supabase] Error guardando check-in:", error.message);
    return false;
  }
  return true;
}

/* ---------- Diario: inserta un registro en la tabla `diario` ---------- */
export async function saveDiarioRecord(entry) {
  const user = await getCurrentUser();
  const { error } = await supabase.from("diario").insert([{
    user_id: user?.id ?? null,
    texto: entry.texto,
    created_at: new Date(entry.timestamp || Date.now()).toISOString(),
  }]);
  if (error) {
    console.error("[Supabase] Error guardando entrada de diario:", error.message);
    return false;
  }
  return true;
}
