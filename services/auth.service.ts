
import { storage } from '../utils/storage';
import { SEED_DATA } from '../data/seed';
import { User } from '../types';

// HUB V3 - Versión definitiva de interoperabilidad local
const AUTH_KEY = 'sacs_auth_user_v3';
const USERS_KEY = 'sacs_users_v3';
const PATIENTS_KEY = 'sacs_patients_v3';
const APPOINTMENTS_KEY = 'sacs_appointments_v3';

export const authService = {
  async init() {
    const existing = await storage.get(USERS_KEY);
    if (!existing) {
      console.log("SACS Hub: Ejecutando migración mandatoria a v3...");
      await storage.set(USERS_KEY, SEED_DATA.users);
      await storage.set(PATIENTS_KEY, SEED_DATA.patients);
      await storage.set(APPOINTMENTS_KEY, SEED_DATA.appointments);
      console.log("SACS Hub: Migración v3 completada con éxito.");
    }
  },

  async login(email: string, pass: string): Promise<User | null> {
    const users = await storage.get<any[]>(USERS_KEY) || [];
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      const { password, ...safeUser } = user;
      await storage.set(AUTH_KEY, safeUser);
      return safeUser;
    }
    throw new Error('HUB V3: Credenciales inválidas. Verifique el correo y la nueva contraseña v3.');
  },

  async logout() {
    await storage.remove(AUTH_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    return await storage.get<User>(AUTH_KEY);
  }
};
