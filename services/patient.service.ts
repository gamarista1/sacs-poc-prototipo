
import { storage } from '../utils/storage';
import { Patient, Appointment, MedicalRecord } from '../types';

export const patientService = {
  async getAll(): Promise<Patient[]> {
    return await storage.get<Patient[]>('sacs_patients') || [];
  },

  async getById(id: string): Promise<Patient | undefined> {
    const patients = await this.getAll();
    return patients.find(p => p.id === id);
  },

  async getHistory(patientId: string): Promise<MedicalRecord[]> {
    const records = await storage.get<MedicalRecord[]>('sacs_medical_records') || [];
    return records.filter(r => r.patient_id === patientId);
  },

  async getAppointments(patientId?: string): Promise<Appointment[]> {
    const appointments = await storage.get<Appointment[]>('sacs_appointments') || [];
    return patientId ? appointments.filter(a => a.patient_id === patientId) : appointments;
  }
};
