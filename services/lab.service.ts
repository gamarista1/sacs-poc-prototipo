
import { storage } from '../utils/storage';
import { LabOrder, LabOrderStatus } from '../types';

export const labService = {
  async getOrders(): Promise<LabOrder[]> {
    return await storage.get<LabOrder[]>('sacs_lab_orders') || [];
  },

  async updateResult(orderId: string, resultUrl: string): Promise<void> {
    const orders = await this.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, status: LabOrderStatus.COMPLETED, results_url: resultUrl } : o);
    await storage.set('sacs_lab_orders', updated);
  }
};
