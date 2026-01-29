
import { storage } from '../utils/storage';
import { Patient, Appointment, MedicalRecord, AppointmentStatus } from '../types';

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
  },

  /**
   * Permite a un paciente solicitar una teleconsulta.
   * La cita se crea en estado REQUESTED y sin fecha.
   */
  async requestTeleconsultation(patientId: string, reason: string): Promise<Appointment> {
    const appointments = await this.getAppointments();
    const patients = await this.getAll();
    const patient = patients.find(p => p.id === patientId);

    if (!patient) throw new Error("Paciente no encontrado para la solicitud");

    const newRequest: Appointment = {
      id: crypto.randomUUID(),
      patient_id: patientId,
      doctor_id: 'u2', // Asignado a Dr. Roberto Meza por defecto para el prototipo
      center_id: patient.center_id,
      status: AppointmentStatus.REQUESTED,
      type: 'TELEMEDICINE',
      reason,
      date: null
    };

    await storage.set('sacs_appointments', [...appointments, newRequest]);
    return newRequest;
  }
};
