
import { storage } from '../utils/storage';
import { SEED_DATA } from '../data/seed';
import { User } from '../types';

// Incremetamos la versión para forzar el reset de credenciales en el cliente
const AUTH_KEY = 'sacs_auth_user_v2';
const USERS_KEY = 'sacs_users_v2';
const PATIENTS_KEY = 'sacs_patients_v2';
const APPOINTMENTS_KEY = 'sacs_appointments_v2';

export const authService = {
  async init() {
    const existing = await storage.get(USERS_KEY);
    if (!existing) {
      console.log("SACS Hub: Inicializando base de datos local v2...");
      await storage.set(USERS_KEY, SEED_DATA.users);
      
      // Inicializar otras tablas fundamentales
      const existingPatients = await storage.get(PATIENTS_KEY);
      if (!existingPatients) await storage.set(PATIENTS_KEY, SEED_DATA.patients);
      
      const existingApts = await storage.get(APPOINTMENTS_KEY);
      if (!existingApts) await storage.set(APPOINTMENTS_KEY, SEED_DATA.appointments);
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
    throw new Error('Credenciales inválidas o cuenta inexistente en el HUB v2');
  },

  async logout() {
    await storage.remove(AUTH_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    return await storage.get<User>(AUTH_KEY);
  }
};
