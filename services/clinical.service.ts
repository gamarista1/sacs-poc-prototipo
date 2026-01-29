
import { storage } from '../utils/storage';
import { MedicalRecord, Prescription, LabOrder, PrescriptionStatus, LabOrderStatus } from '../types';

export const clinicalService = {
  async createSOAPNote(note: Omit<MedicalRecord, 'id' | 'created_at'>): Promise<MedicalRecord> {
    const records = await storage.get<MedicalRecord[]>('sacs_medical_records') || [];
    const newRecord = { ...note, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    await storage.set('sacs_medical_records', [...records, newRecord]);
    return newRecord;
  },

  async createPrescription(presc: Omit<Prescription, 'id' | 'validation_code' | 'status'>): Promise<Prescription> {
    const prescriptions = await storage.get<Prescription[]>('sacs_prescriptions') || [];
    const newPresc: Prescription = {
      ...presc,
      id: crypto.randomUUID(),
      validation_code: crypto.randomUUID().split('-')[0].toUpperCase(),
      status: PrescriptionStatus.PENDING
    };
    await storage.set('sacs_prescriptions', [...prescriptions, newPresc]);
    return newPresc;
  },

  async createLabOrder(order: Omit<LabOrder, 'id' | 'status' | 'created_at'>): Promise<LabOrder> {
    const orders = await storage.get<LabOrder[]>('sacs_lab_orders') || [];
    const newOrder: LabOrder = {
      ...order,
      id: crypto.randomUUID(),
      status: LabOrderStatus.RECEIVED,
      created_at: new Date().toISOString()
    };
    await storage.set('sacs_lab_orders', [...orders, newOrder]);
    return newOrder;
  }
};
