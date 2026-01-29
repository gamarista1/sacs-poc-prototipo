
-- SACS TELEMEDICINA - DATABASE SCHEMA (SUPABASE SQL EDITOR)

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM (
  'super_admin', 
  'center_admin', 
  'doctor', 
  'staff', 
  'patient', 
  'lab_user', 
  'pharmacy_user'
);

CREATE TYPE order_status AS ENUM (
  'pending', 
  'in_progress', 
  'completed', 
  'cancelled'
);

-- 2. CORE TABLES
CREATE TABLE medical_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  region TEXT,
  city TEXT,
  country TEXT DEFAULT 'Honduras',
  is_active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}', -- Módulos activos, temas, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  center_id UUID REFERENCES medical_centers(id),
  role user_role NOT NULL DEFAULT 'patient',
  full_name TEXT,
  phone TEXT,
  mfa_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_id UUID REFERENCES medical_centers(id) NOT NULL,
  external_id TEXT, -- ID en el HIS origen
  document_id TEXT NOT NULL, -- DNI / Pasaporte
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE,
  gender TEXT,
  email TEXT,
  phone TEXT,
  source_system TEXT DEFAULT 'SACS-SCI',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- 3. CLINICAL TABLES (SCI & ORCHESTRATION)
CREATE TABLE clinical_encounters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_id UUID REFERENCES medical_centers(id) NOT NULL,
  patient_id UUID REFERENCES patients(id) NOT NULL,
  doctor_id UUID REFERENCES profiles(id) NOT NULL,
  encounter_type TEXT DEFAULT 'telemedicine', -- physical, virtual
  soap_subjective TEXT,
  soap_objective TEXT,
  soap_assessment TEXT,
  soap_plan TEXT,
  digital_signature TEXT, -- Hash de la firma
  source_system TEXT DEFAULT 'SACS-SCI',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

CREATE TABLE lab_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_id UUID REFERENCES medical_centers(id) NOT NULL,
  patient_id UUID REFERENCES patients(id) NOT NULL,
  encounter_id UUID REFERENCES clinical_encounters(id),
  status order_status DEFAULT 'pending',
  tests_requested JSONB NOT NULL,
  source_system TEXT DEFAULT 'SACS-SCI',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lab_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_id UUID REFERENCES medical_centers(id) NOT NULL,
  patient_id UUID REFERENCES patients(id) NOT NULL,
  order_id UUID REFERENCES lab_orders(id),
  result_data JSONB,
  file_url TEXT, -- URL en Supabase Storage
  validated_by UUID REFERENCES profiles(id),
  source_system TEXT DEFAULT 'LAB-EXTERNAL',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_id UUID REFERENCES medical_centers(id) NOT NULL,
  patient_id UUID REFERENCES patients(id) NOT NULL,
  encounter_id UUID REFERENCES clinical_encounters(id),
  medications JSONB NOT NULL,
  is_dispensed BOOLEAN DEFAULT false,
  dispensed_at TIMESTAMPTZ,
  source_system TEXT DEFAULT 'SACS-SCI',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUDIT SYSTEM (IMMUTABLE)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_id UUID REFERENCES medical_centers(id),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE medical_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 6. POLICIES

-- Profiles: Usuarios ven su propio perfil o admins de su centro ven perfiles del centro
CREATE POLICY "Profiles viewable by owner or center admin" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'center_admin') 
      AND p.center_id = profiles.center_id
    )
  );

-- Patients: Solo accesibles por personal del mismo centro
CREATE POLICY "Patients isolated by center_id" ON patients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND (p.center_id = patients.center_id OR p.role = 'super_admin')
    )
  );

-- Clinical Data: Aislado por centro
CREATE POLICY "Encounters isolated by center_id" ON clinical_encounters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND (p.center_id = clinical_encounters.center_id OR p.role = 'super_admin')
    )
  );

-- Audit Logs: Solo lectura para super_admin o auditores
CREATE POLICY "Audit logs read-only for admins" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'center_admin')
    )
  );

-- 7. FUNCTIONS (Atomic transfers / Interop)
CREATE OR REPLACE FUNCTION record_audit_log() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (center_id, user_id, action, entity_type, entity_id, new_data)
  VALUES (
    (SELECT center_id FROM profiles WHERE id = auth.uid()),
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    row_to_json(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger Audit
CREATE TRIGGER tr_audit_patients AFTER INSERT OR UPDATE ON patients
FOR EACH ROW EXECUTE FUNCTION record_audit_log();
