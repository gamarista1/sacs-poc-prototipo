
import { createClient } from '@supabase/supabase-js';

// Credenciales proporcionadas para la conexión de SACS Telemedicina
const supabaseUrl = 'https://dgqaxbygsdhrniugnalb.supabase.co';
const supabaseKey = 'sb_publishable_aJa8G8pGgBQt0ljaLQ5Ggg_zPojTbXt';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Evita conflictos de señal en re-renders rápidos
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: { 'x-application-name': 'sacs-clinical-hub' }
  }
});

/**
 * Obtiene la sesión actual del usuario.
 */
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      if (error.name === 'AbortError') return null;
      console.error("Error obteniendo sesión:", error.message);
      return null;
    }
    return session;
  } catch (e) {
    return null;
  }
};

/**
 * Obtiene el perfil completo del usuario junto con la información de su centro médico.
 */
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      medical_centers (
        id,
        name,
        region,
        is_active
      )
    `)
    .eq('id', userId)
    .single();
  
  if (error) {
    if (error.name !== 'AbortError') {
      console.error("Error obteniendo perfil:", error.message);
    }
    throw error;
  }
  return data;
};
