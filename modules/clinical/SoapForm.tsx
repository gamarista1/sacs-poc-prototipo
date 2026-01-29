
import React, { useState } from 'react';
import { Patient, Appointment } from '../../types';
import { useToast } from '../../context/ToastContext';

interface SoapFormProps {
  patient: Patient;
  appointment: Appointment;
  onSave: (data: any) => Promise<void>;
  onPrescription: () => void;
  onLabOrder: () => void;
}

const SoapForm: React.FC<SoapFormProps> = ({ patient, appointment, onSave, onPrescription, onLabOrder }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjective || !formData.plan) {
      showToast("Por favor complete los campos mínimos requeridos", "error");
      return;
    }
    setIsSaving(true);
    try {
      await onSave(formData);
      showToast("Historia Clínica guardada con éxito", "success");
    } catch (err) {
      showToast("Error al procesar la solicitud clínica", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const SoapSection = ({ label, id, value, onChange, placeholder, icon }: any) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <span className="w-8 h-8 bg-sacs-50 rounded-lg flex items-center justify-center text-sacs-500 text-xs font-black">
          {icon}
        </span>
        <label htmlFor={id} className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
          {label}
        </label>
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-32 p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-sacs-500 focus:ring-4 focus:ring-sacs-500/5 outline-none transition-all font-medium text-slate-700 resize-none soap-input"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="bg-white rounded-[2.5rem] shadow-clinical border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-black text-sacs-500 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 bg-mint-400 rounded-full animate-pulse"></span>
            <span>Consulta en Progreso</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {patient.first_name} {patient.last_name}
          </h2>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {patient.document_id} • {patient.gender} • {new Date().getFullYear() - new Date(patient.birth_date).getFullYear()} Años
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            type="button"
            onClick={onPrescription}
            className="px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-sacs-500 hover:text-sacs-500 transition-all flex items-center"
          >
            <span className="mr-2 text-base">💊</span> Receta
          </button>
          <button 
            type="button"
            onClick={onLabOrder}
            className="px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-sacs-500 hover:text-sacs-500 transition-all flex items-center"
          >
            <span className="mr-2 text-base">🧪</span> Orden Lab
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SoapSection 
            label="S: Subjetivo" 
            id="subjective"
            icon="S"
            value={formData.subjective}
            onChange={(v: string) => setFormData({...formData, subjective: v})}
            placeholder="Motivo de consulta, síntomas referidos por el paciente..."
          />
          <SoapSection 
            label="O: Objetivo" 
            id="objective"
            icon="O"
            value={formData.objective}
            onChange={(v: string) => setFormData({...formData, objective: v})}
            placeholder="Examen físico, signos vitales, hallazgos clínicos..."
          />
          <SoapSection 
            label="A: Evaluación" 
            id="assessment"
            icon="A"
            value={formData.assessment}
            onChange={(v: string) => setFormData({...formData, assessment: v})}
            placeholder="Impresión diagnóstica, diagnósticos diferenciales..."
          />
          <SoapSection 
            label="P: Plan" 
            id="plan"
            icon="P"
            value={formData.plan}
            onChange={(v: string) => setFormData({...formData, plan: v})}
            placeholder="Tratamiento, exámenes solicitados, seguimiento..."
          />
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-10 py-4 bg-sacs-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-sacs-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-3 disabled:opacity-70"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Guardar Historia Clínica</span>
                <span className="text-lg">💾</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SoapForm;
