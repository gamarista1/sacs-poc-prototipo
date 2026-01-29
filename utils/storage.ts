
const DELAY = 800;

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * DELAY));
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },

  async set<T>(key: string, value: T): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * DELAY));
    localStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    localStorage.removeItem(key);
  }
};
