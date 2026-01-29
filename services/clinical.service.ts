
import { storage } from '../utils/storage';
import { MedicalRecord, Prescription, LabOrder, PrescriptionStatus, LabOrderStatus, Appointment, AppointmentStatus } from '../types';

const RECORDS_KEY = 'sacs_medical_records_v3';
const PRESC_KEY = 'sacs_prescriptions_v3';
const LAB_KEY = 'sacs_lab_orders_v3';
const APTS_KEY = 'sacs_appointments_v3';

export const clinicalService = {
  async createSOAPNote(note: Omit<MedicalRecord, 'id' | 'created_at'>): Promise<MedicalRecord> {
    const records = await storage.get<MedicalRecord[]>(RECORDS_KEY) || [];
    const newRecord = { ...note, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    await storage.set(RECORDS_KEY, [...records, newRecord]);
    return newRecord;
  },

  async createPrescription(presc: Omit<Prescription, 'id' | 'validation_code' | 'status'>): Promise<Prescription> {
    const prescriptions = await storage.get<Prescription[]>(PRESC_KEY) || [];
    const newPresc: Prescription = {
      ...presc,
      id: crypto.randomUUID(),
      validation_code: crypto.randomUUID().split('-')[0].toUpperCase(),
      status: PrescriptionStatus.PENDING
    };
    await storage.set(PRESC_KEY, [...prescriptions, newPresc]);
    return newPresc;
  },

  async createLabOrder(order: Omit<LabOrder, 'id' | 'status' | 'created_at'>): Promise<LabOrder> {
    const orders = await storage.get<LabOrder[]>(LAB_KEY) || [];
    const newOrder: LabOrder = {
      ...order,
      id: crypto.randomUUID(),
      status: LabOrderStatus.RECEIVED,
      created_at: new Date().toISOString()
    };
    await storage.set(LAB_KEY, [...orders, newOrder]);
    return newOrder;
  },

  async counterProposeAppointment(appointmentId: string, newDate: string): Promise<Appointment> {
    const appointments = await storage.get<Appointment[]>(APTS_KEY) || [];
    const index = appointments.findIndex(a => a.id === appointmentId);
    
    if (index === -1) throw new Error("Cita no encontrada");

    appointments[index] = {
      ...appointments[index],
      status: AppointmentStatus.PROPOSED_BY_DOCTOR,
      proposedDate: newDate
    };

    await storage.set(APTS_KEY, appointments);
    return appointments[index];
  },

  async attendEmergency(appointmentId: string): Promise<Appointment> {
    const appointments = await storage.get<Appointment[]>(APTS_KEY) || [];
    const index = appointments.findIndex(a => a.id === appointmentId);
    
    if (index === -1) throw new Error("Emergencia no encontrada");

    appointments[index] = {
      ...appointments[index],
      status: AppointmentStatus.IN_PROGRESS
    };

    await storage.set(APTS_KEY, appointments);
    return appointments[index];
  }
};
