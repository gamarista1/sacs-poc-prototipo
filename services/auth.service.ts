
import { storage } from '../utils/storage';
import { SEED_DATA } from '../data/seed';
import { User } from '../types';

const AUTH_KEY = 'sacs_auth_user';
const USERS_KEY = 'sacs_users';

export const authService = {
  async init() {
    const existing = await storage.get(USERS_KEY);
    if (!existing) {
      await storage.set(USERS_KEY, SEED_DATA.users);
      // Inicializar otras tablas si están vacías
      if (!(await storage.get('sacs_patients'))) await storage.set('sacs_patients', SEED_DATA.patients);
      if (!(await storage.get('sacs_appointments'))) await storage.set('sacs_appointments', SEED_DATA.appointments);
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
    throw new Error('Credenciales inválidas');
  },

  async logout() {
    await storage.remove(AUTH_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    return await storage.get<User>(AUTH_KEY);
  }
};
