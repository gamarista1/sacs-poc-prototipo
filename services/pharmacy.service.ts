
import { storage } from '../utils/storage';
import { Prescription, PrescriptionStatus } from '../types';

export const pharmacyService = {
  async validatePrescription(code: string): Promise<Prescription | null> {
    const prescriptions = await storage.get<Prescription[]>('sacs_prescriptions') || [];
    return prescriptions.find(p => p.validation_code === code && p.status === PrescriptionStatus.PENDING) || null;
  },

  async dispense(prescriptionId: string): Promise<void> {
    const prescriptions = await storage.get<Prescription[]>('sacs_prescriptions') || [];
    const updated = prescriptions.map(p => 
      p.id === prescriptionId ? { ...p, status: PrescriptionStatus.DISPENSED, dispensed_at: new Date().toISOString() } : p
    );
    await storage.set('sacs_prescriptions', updated);
  }
};
