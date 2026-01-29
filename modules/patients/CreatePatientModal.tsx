
import React, { useState } from 'react';
import { supabase } from '../../services/supabase';

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (id: string) => void;
}

const CreatePatientModal: React.FC<CreatePatientModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    document_id: '',
    birth_date: '',
    gender: 'otro',
    consent_given: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.consent_given) {
      setError("El consentimiento del paciente es obligatorio por norma HL7-FHIR y legal.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. INTENTO PRIMARIO: Edge Function
      // Intentamos llamar a la orquestación centralizada
      try {
        const { data: funcData, error: funcError } = await supabase.functions.invoke('create-patient', {
          body: formData
        });
        
        if (!funcError && funcData?.patient_id) {
          onSuccess(funcData.patient_id);
          onClose();
          return;
        }
      } catch (fErr) {
        console.warn("Edge Function no accesible o no desplegada. Iniciando protocolo de resiliencia local (SCI Fallback)...");
      }

      // 2. FALLBACK: Inserción Directa con Seguridad RLS
      // Obtenemos sesión y perfil para garantizar multi-tenancy
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sesión clínica expirada. Por favor, re-autentíquese.");

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('center_id, role')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile?.center_id) {
        throw new Error("Su perfil no tiene un Centro Médico asociado. Contacte al Administrador.");
      }

      // Inserción del paciente directamente respetando RLS
      const { data: newPatient, error: insertError } = await supabase
        .from('patients')
        .insert({
          ...formData,
          center_id: profile.center_id,
          created_by: session.user.id,
          source_system: 'SACS-SCI (Direct)'
        })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '42501') throw new Error("Permisos insuficientes: Su rol no permite registrar pacientes en este centro.");
        throw insertError;
      }

      // 3. AUDITORÍA INMUTABLE (Requisito Sanitario)
      // Registramos el acto administrativo localmente
      await supabase.from('clinical_audit').insert({
        center_id: profile.center_id,
        actor_id: session.user.id,
        action_type: 'CREATE_PATIENT_FALLBACK',
        entity_id: newPatient.id,
        clinical_payload: { patient_snapshot: newPatient }
      });

      onSuccess(newPatient.id);
      onClose();
    } catch (err: any) {
      console.error("Critical Clinical Error:", err);
      setError(err.message || "Error fatal de orquestación clínica. Intente de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-sacs-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Registro de Paciente</h2>
            <p className="text-sm text-slate-500 font-medium">Protocolo SCI - Orquestación de Identidad</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 animate-shake">
              <span className="text-red-500 mt-0.5">⚠️</span>
              <div className="flex-1 text-sm font-bold text-red-700 leading-tight">
                {error}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nombres</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mint-400 focus:ring-4 focus:ring-mint-400/10 outline-none transition-all font-medium"
                placeholder="Juan Andrés"
                value={formData.first_name}
                onChange={e => setFormData({...formData, first_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Apellidos</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mint-400 focus:ring-4 focus:ring-mint-400/10 outline-none transition-all font-medium"
                placeholder="Pérez Gómez"
                value={formData.last_name}
                onChange={e => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Documento de Identidad</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mint-400 focus:ring-4 focus:ring-mint-400/10 outline-none transition-all font-medium"
                placeholder="DNI / Pasaporte"
                value={formData.document_id}
                onChange={e => setFormData({...formData, document_id: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Fecha de Nacimiento</label>
              <input 
                required
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mint-400 focus:ring-4 focus:ring-mint-400/10 outline-none transition-all font-medium"
                value={formData.birth_date}
                onChange={e => setFormData({...formData, birth_date: e.target.value})}
              />
            </div>
          </div>

          <div className="bg-mint-400/5 p-6 rounded-2xl border border-mint-400/20">
            <div className="flex items-start space-x-3">
              <input 
                type="checkbox"
                id="consent"
                className="mt-1 w-5 h-5 rounded border-slate-300 text-sacs-500 focus:ring-mint-400 transition-all cursor-pointer"
                checked={formData.consent_given}
                onChange={e => setFormData({...formData, consent_given: e.target.checked})}
              />
              <label htmlFor="consent" className="text-sm font-medium text-slate-700 leading-relaxed cursor-pointer select-none">
                Confirmo que el paciente ha otorgado su <span className="text-sacs-500 font-bold underline decoration-mint-400 decoration-2">Consentimiento Informado</span> para ser registrado en la red de interoperabilidad SACS.
              </label>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-4 text-sm font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-4 bg-sacs-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-sacs-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-lg">✓</span>
                  <span>Confirmar Registro</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePatientModal;
