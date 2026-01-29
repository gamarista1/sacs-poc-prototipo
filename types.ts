
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
  type: 'VIRTUAL' | 'PHYSICAL' | 'TELEMEDICINE';
  reason: string;
  teleconsultationId?: string; // Vinculación con sesión de video
}

// Estructura SOAP para Notas Clínicas (Standard Médico)
export interface MedicalRecord {
  id: string;
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  subjective: string; // Lo que el paciente refiere
  objective: string;  // Lo que el médico observa (signos vitales, etc)
  assessment: string; // Diagnóstico (CIE-10 ready)
  plan: string;       // Pasos a seguir
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
  validation_code: string; // UUID/Hash para farmacia
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
