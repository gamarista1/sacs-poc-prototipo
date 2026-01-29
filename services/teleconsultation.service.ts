
import { storage } from '../utils/storage';
import { TeleconsultationSession } from '../types/telemedicina';

const SESSIONS_KEY = 'sacs_telemed_sessions';

export const teleconsultationService = {
  /**
   * Inicializa una nueva sesión de telemedicina vinculada a una cita.
   */
  async initializeSession(appointmentId: string, doctorId: string, patientId: string): Promise<TeleconsultationSession> {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulación de handshake con el servidor

    const sessions = await storage.get<TeleconsultationSession[]>(SESSIONS_KEY) || [];
    
    const newSession: TeleconsultationSession = {
      id: crypto.randomUUID(),
      appointmentId,
      doctorId,
      patientId,
      startTime: new Date().toISOString(),
      status: 'WAITING',
      durationSeconds: 0
    };

    await storage.set(SESSIONS_KEY, [...sessions, newSession]);
    return newSession;
  },

  /**
   * Simula el proceso de unión a una sala de video.
   */
  async joinRoom(sessionId: string): Promise<TeleconsultationSession> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const sessions = await storage.get<TeleconsultationSession[]>(SESSIONS_KEY) || [];
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) throw new Error("Sesión no encontrada");

    sessions[sessionIndex].status = 'ACTIVE';
    await storage.set(SESSIONS_KEY, sessions);
    
    return sessions[sessionIndex];
  },

  /**
   * Finaliza la sesión y actualiza el registro histórico.
   */
  async endSession(sessionId: string): Promise<void> {
    const sessions = await storage.get<TeleconsultationSession[]>(SESSIONS_KEY) || [];
    const updatedSessions = sessions.map(s => 
      s.id === sessionId ? { ...s, status: 'COMPLETED' as const } : s
    );
    await storage.set(SESSIONS_KEY, updatedSessions);
  },

  /**
   * Obtiene los detalles de una sesión específica.
   */
  async getSessionDetails(sessionId: string): Promise<TeleconsultationSession | undefined> {
    const sessions = await storage.get<TeleconsultationSession[]>(SESSIONS_KEY) || [];
    return sessions.find(s => s.id === sessionId);
  }
};
