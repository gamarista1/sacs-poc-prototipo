
import React, { useState } from 'react';
import { pharmacyService } from '../../services/pharmacy.service';
import { patientService } from '../../services/patient.service';
import { Prescription, PrescriptionStatus, Patient } from '../../types';

const PharmacyDashboard: React.FC = () => {
  const [searchCode, setSearchCode] = useState('');
  const [prescription, setPrescription] = useState<(Prescription & { patient?: Patient }) | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDispensing, setIsDispensing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode) return;
    
    setError(null);
    setPrescription(null);
    setIsSearching(true);
    
    try {
      const presc = await pharmacyService.validatePrescription(searchCode.toUpperCase());
      if (presc) {
        const patient = await patientService.getById(presc.patient_id);
        setPrescription({ ...presc, patient });
      } else {
        setError("Receta no encontrada o ya fue dispensada anteriormente.");
      }
    } catch (err) {
      setError("Error en la conexión con el servidor de interoperabilidad.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDispense = async () => {
    if (!prescription) return;
    setIsDispensing(true);
    try {
      await pharmacyService.dispense(prescription.id);
      alert("Medicamentos dispensados correctamente. Stock actualizado.");
      setPrescription(null);
      setSearchCode('');
    } catch (err) {
      alert("Error al procesar la dispensación.");
    } finally {
      setIsDispensing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Módulo de <span className="text-sacs-500">Farmacia</span></h1>
        <p className="text-slate-500 font-medium mt-2">Validación criptográfica de recetas y gestión de dispensación segura.</p>
      </div>

      {/* Hero Search */}
      <div className="bg-white p-10 rounded-[3rem] shadow-clinical border border-slate-200 text-center space-y-8">
        <div className="max-w-md mx-auto space-y-4">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Ingrese UUID de la Receta</label>
          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-center text-2xl font-black tracking-[0.2em] uppercase placeholder:text-slate-200 focus:border-mint-400 focus:ring-8 focus:ring-mint-400/5 outline-none transition-all"
              placeholder="XXXX-XXXX"
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="absolute right-4 top-4 bottom-4 px-6 bg-sacs-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-sacs-900/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            >
              {isSearching ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "Validar"}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-shake inline-block">
            <span>⚠️ {error}</span>
          </div>
        )}
      </div>

      {/* Prescription Details */}
      {prescription && (
        <div className="bg-white rounded-[2.5rem] shadow-clinical border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-sacs-50/30">
            <div>
              <div className="flex items-center space-x-2 text-[10px] font-black text-sacs-500 uppercase tracking-widest mb-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Receta Válida • SCI-HL7 Verified</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                {prescription.patient?.first_name} {prescription.patient?.last_name}
              </h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                DOC: {prescription.patient?.document_id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Código de Validación</p>
              <p className="text-2xl font-black text-sacs-900 tracking-widest font-mono">{prescription.validation_code}</p>
            </div>
          </div>

          <div className="p-10 space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Medicamentos Prescritos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prescription.medications.map((med, idx) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">💊</div>
                  <div>
                    <p className="text-lg font-black text-slate-800 leading-tight">{med.name}</p>
                    <p className="text-[10px] font-bold text-sacs-500 uppercase tracking-widest mt-1">{med.dosage}</p>
                    <p className="text-xs font-medium text-slate-500 mt-2">{med.frequency} • {med.duration}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-slate-100 flex justify-center">
              <button 
                onClick={handleDispense}
                disabled={isDispensing}
                className="px-16 py-6 bg-sacs-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-sacs-900/30 hover:scale-[1.05] active:scale-95 transition-all flex items-center space-x-4"
              >
                {isDispensing ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="text-xl">📦</span>
                    <span>Confirmar Dispensación</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDashboard;
