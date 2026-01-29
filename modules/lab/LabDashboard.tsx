
import React, { useState, useEffect } from 'react';
import { labService } from '../../services/lab.service';
import { patientService } from '../../services/patient.service';
import { LabOrder, LabOrderStatus, Patient } from '../../types';

const LabDashboard: React.FC = () => {
  const [orders, setOrders] = useState<(LabOrder & { patient?: Patient })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<(LabOrder & { patient?: Patient }) | null>(null);
  const [resultUrl, setResultUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const allOrders = await labService.getOrders();
      const patients = await patientService.getAll();
      const ordersWithPatients = allOrders.map(order => ({
        ...order,
        patient: patients.find(p => p.id === order.patient_id)
      }));
      setOrders(ordersWithPatients);
    } catch (error) {
      console.error("Error cargando órdenes de lab:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !resultUrl) return;
    
    setIsSubmitting(true);
    try {
      await labService.updateResult(selectedOrder.id, resultUrl);
      alert("Resultados cargados y orden completada.");
      setSelectedOrder(null);
      setResultUrl('');
      loadOrders();
    } catch (error) {
      alert("Error al completar la orden.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Módulo de <span className="text-sacs-500">Laboratorio</span></h1>
          <p className="text-slate-500 font-medium">Procesamiento de analíticas y validación de resultados HL7.</p>
        </div>
        <div className="bg-sacs-50 px-4 py-2 rounded-xl border border-sacs-100">
          <span className="text-[10px] font-black text-sacs-500 uppercase tracking-widest">Órdenes Pendientes: {orders.filter(o => o.status !== LabOrderStatus.COMPLETED).length}</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-clinical border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Paciente</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">ID Orden</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Exámenes</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6 h-16 bg-slate-50/30"></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No hay órdenes registradas</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-sacs-50 rounded-xl flex items-center justify-center font-bold text-sacs-500 text-xs">
                          {order.patient?.first_name[0]}{order.patient?.last_name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{order.patient?.first_name} {order.patient?.last_name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{order.patient?.document_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-[10px] text-slate-400">
                      {order.id.split('-')[0].toUpperCase()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-1">
                        {order.tests.map((test, i) => (
                          <span key={i} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter">
                            {test}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.status === LabOrderStatus.COMPLETED ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {order.status !== LabOrderStatus.COMPLETED && (
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 bg-sacs-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-sacs-900/10"
                        >
                          Cargar Resultados
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Resultados */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-sacs-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Carga de Resultados</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Paciente: {selectedOrder.patient?.first_name} {selectedOrder.patient?.last_name}
              </p>
            </div>
            <form onSubmit={handleCompleteOrder} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL de Informe / Datos (Simulado)</label>
                <input 
                  required
                  type="url"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-sacs-500 focus:ring-4 focus:ring-sacs-500/10 outline-none transition-all font-semibold text-slate-700"
                  placeholder="https://storage.sacs.com/results/..."
                  value={resultUrl}
                  onChange={(e) => setResultUrl(e.target.value)}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-sacs-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-sacs-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "Finalizar Orden"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabDashboard;
