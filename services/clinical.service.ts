
import { storage } from '../utils/storage';
import { MedicalRecord, Prescription, LabOrder, PrescriptionStatus, LabOrderStatus, Appointment, AppointmentStatus } from '../types';

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
  },

  /**
   * Confirma una solicitud de cita asignándole una fecha y hora.
   */
  async confirmAppointment(appointmentId: string, scheduledDate: string): Promise<Appointment> {
    const appointments = await storage.get<Appointment[]>('sacs_appointments') || [];
    const index = appointments.findIndex(a => a.id === appointmentId);
    
    if (index === -1) throw new Error("Cita no encontrada");

    appointments[index] = {
      ...appointments[index],
      status: AppointmentStatus.CONFIRMED,
      date: scheduledDate
    };

    await storage.set('sacs_appointments', appointments);
    return appointments[index];
  },

  /**
   * Obtiene las solicitudes de teleconsulta pendientes para un centro específico.
   */
  async getPendingRequests(centerId: string): Promise<Appointment[]> {
    const appointments = await storage.get<Appointment[]>('sacs_appointments') || [];
    return appointments.filter(a => a.center_id === centerId && a.status === AppointmentStatus.REQUESTED);
  }
};
