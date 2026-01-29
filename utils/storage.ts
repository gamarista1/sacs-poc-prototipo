
const DELAY_BASE = 400;

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    // Reducción del jitter para mayor estabilidad en la señal
    await new Promise(resolve => setTimeout(resolve, Math.random() * (DELAY_BASE / 2)));
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },

  async set<T>(key: string, value: T): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    localStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    localStorage.removeItem(key);
  }
};
