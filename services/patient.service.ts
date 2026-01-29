
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

  async requestTeleconsultation(patientId: string, reason: string): Promise<Appointment> {
    const appointments = await this.getAppointments();
    const patients = await this.getAll();
    const patient = patients.find(p => p.id === patientId);

    if (!patient) throw new Error("Paciente no encontrado para la solicitud");

    const newRequest: Appointment = {
      id: crypto.randomUUID(),
      patient_id: patientId,
      doctor_id: 'u2',
      center_id: patient.center_id,
      status: AppointmentStatus.REQUESTED,
      type: 'TELEMEDICINE',
      reason,
      date: null
    };

    await storage.set('sacs_appointments', [...appointments, newRequest]);
    return newRequest;
  },

  async requestRoutineAppointment(patientId: string, desiredDate: string, reason: string): Promise<Appointment> {
    const appointments = await this.getAppointments();
    const patients = await this.getAll();
    const patient = patients.find(p => p.id === patientId);

    if (!patient) throw new Error("Paciente no encontrado");

    const newRequest: Appointment = {
      id: crypto.randomUUID(),
      patient_id: patientId,
      doctor_id: 'u2',
      center_id: patient.center_id,
      status: AppointmentStatus.REQUESTED_BY_PATIENT,
      type: 'ROUTINE',
      reason,
      patientNotes: reason,
      date: desiredDate
    };

    await storage.set('sacs_appointments', [...appointments, newRequest]);
    return newRequest;
  },

  async requestEmergency(patientId: string, reason: string): Promise<Appointment> {
    const appointments = await this.getAppointments();
    const patients = await this.getAll();
    const patient = patients.find(p => p.id === patientId);

    if (!patient) throw new Error("Paciente no encontrado");

    const newEmergency: Appointment = {
      id: crypto.randomUUID(),
      patient_id: patientId,
      doctor_id: 'u2',
      center_id: patient.center_id,
      status: AppointmentStatus.WAITING_FOR_TRIAGE,
      type: 'EMERGENCY',
      reason,
      patientNotes: reason,
      date: new Date().toISOString()
    };

    await storage.set('sacs_appointments', [...appointments, newEmergency]);
    return newEmergency;
  },

  async acceptDoctorProposal(appointmentId: string): Promise<Appointment> {
    const appointments = await this.getAppointments();
    const index = appointments.findIndex(a => a.id === appointmentId);
    
    if (index === -1) throw new Error("Cita no encontrada");
    const apt = appointments[index];

    if (!apt.proposedDate) throw new Error("No hay una fecha propuesta por el médico");

    appointments[index] = {
      ...apt,
      status: AppointmentStatus.CONFIRMED_BY_PATIENT,
      date: apt.proposedDate,
      proposedDate: null
    };

    await storage.set('sacs_appointments', appointments);
    return appointments[index];
  },

  async rejectProposal(appointmentId: string): Promise<void> {
    const appointments = await this.getAppointments();
    const updated = appointments.map(a => 
      a.id === appointmentId ? { ...a, status: AppointmentStatus.CANCELLED } : a
    );
    await storage.set('sacs_appointments', updated);
  }
};
