
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  CENTER_ADMIN = 'center_admin',
  DOCTOR = 'doctor',
  STAFF = 'staff',
  PATIENT = 'patient',
  LAB_TECH = 'lab_tech',
  PHARMACIST = 'pharmacist'
}

export enum AppointmentStatus {
  REQUESTED = 'REQUESTED',
  REQUESTED_BY_PATIENT = 'REQUESTED_BY_PATIENT',
  PROPOSED_BY_DOCTOR = 'PROPOSED_BY_DOCTOR',
  CONFIRMED_BY_PATIENT = 'CONFIRMED_BY_PATIENT',
  WAITING_FOR_TRIAGE = 'WAITING_FOR_TRIAGE',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PrescriptionStatus {
  PENDING = 'PENDING',
  DISPENSED = 'DISPENSED',
  EXPIRED = 'EXPIRED'
}

export enum LabOrderStatus {
  RECEIVED = 'RECEIVED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  center_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export interface Patient {
  id: string;
  center_id: string;
  document_id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  blood_type?: string;
  allergies?: string[];
  source_system: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  center_id: string;
  date?: string | null;
  status: AppointmentStatus;
  type: 'VIRTUAL' | 'PHYSICAL' | 'TELEMEDICINE' | 'ROUTINE' | 'EMERGENCY';
  reason: string;
  patientNotes?: string;
  doctorNotes?: string;
  proposedDate?: string | null;
  teleconsultationId?: string;
}

export interface MedicalRecord {
  id: string;
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  created_at: string;
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  medical_record_id: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  validation_code: string;
  status: PrescriptionStatus;
  dispensed_at?: string;
}

export interface LabOrder {
  id: string;
  patient_id: string;
  doctor_id: string;
  center_id: string;
  tests: string[];
  status: LabOrderStatus;
  results_url?: string;
  clinical_notes?: string;
  created_at: string;
}
