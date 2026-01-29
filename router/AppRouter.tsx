
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../modules/auth/LoginPage';
import Dashboard from '../modules/dashboard/Dashboard';
import DoctorDashboard from '../modules/clinical/DoctorDashboard';
import LabDashboard from '../modules/lab/LabDashboard';
import PharmacyDashboard from '../modules/pharmacy/PharmacyDashboard';
import PatientPortal from '../modules/patient/PatientPortal';
import Layout from '../components/Layout';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface DashboardWrapperProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  // Si no hay usuario aún (cargando), mostramos un loader básico
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-clinical-bg">
      <div className="w-12 h-12 border-4 border-mint-400 border-t-sacs-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Layout 
        role={user.role} 
        userName={user.full_name} 
        centerName="Hospital Central SACS"
      >
        {children}
      </Layout>
    </ProtectedRoute>
  );
};

const AppRouter: React.FC = () => {
  const { user } = useAuth();

  // Función para determinar a qué módulo enviar al usuario al entrar a la raíz /
  const getHomeRedirect = () => {
    if (!user) return "/login";
    switch (user.role) {
      case UserRole.DOCTOR: return "/doctor";
      case UserRole.LAB_TECH: return "/lab";
      case UserRole.PHARMACIST: return "/pharmacy";
      case UserRole.PATIENT: return "/patient";
      case UserRole.SUPER_ADMIN:
      case UserRole.CENTER_ADMIN:
        return "/doctor"; // Los admins van al dashboard clínico por defecto
      default: return "/unauthorized";
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Redirección inteligente al Dashboard según rol con mayor seguridad */}
      <Route path="/" element={
        <ProtectedRoute>
          <Navigate to={getHomeRedirect()} replace />
        </ProtectedRoute>
      } />

      {/* Rutas de Doctor / Clínica */}
      <Route path="/doctor/*" element={
        <DashboardWrapper allowedRoles={[UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN]}>
          <Routes>
            <Route index element={<DoctorDashboard />} />
            <Route path="analytics" element={<Dashboard />} />
          </Routes>
        </DashboardWrapper>
      } />

      {/* Rutas de Laboratorio */}
      <Route path="/lab/*" element={
        <DashboardWrapper allowedRoles={[UserRole.LAB_TECH, UserRole.SUPER_ADMIN, UserRole.DOCTOR]}>
          <Routes>
            <Route index element={<LabDashboard />} />
          </Routes>
        </DashboardWrapper>
      } />

      {/* Rutas de Farmacia */}
      <Route path="/pharmacy/*" element={
        <DashboardWrapper allowedRoles={[UserRole.PHARMACIST, UserRole.SUPER_ADMIN]}>
          <Routes>
            <Route index element={<PharmacyDashboard />} />
          </Routes>
        </DashboardWrapper>
      } />

      {/* Rutas del Paciente */}
      <Route path="/patient/*" element={
        <DashboardWrapper allowedRoles={[UserRole.PATIENT, UserRole.SUPER_ADMIN]}>
          <Routes>
            <Route index element={<PatientPortal />} />
          </Routes>
        </DashboardWrapper>
      } />

      {/* Rutas de error */}
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex flex-col items-center justify-center bg-clinical-bg p-8 text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner">🚫</div>
          <h1 className="text-6xl font-black text-sacs-900 mb-2">403</h1>
          <p className="text-xl font-bold text-slate-500 uppercase tracking-widest">Acceso Restringido</p>
          <p className="text-slate-400 mt-2 max-w-xs">Su perfil no cuenta con los permisos necesarios para visualizar este módulo clínico.</p>
          <button 
            onClick={() => window.location.href = '#/'} 
            className="mt-8 px-10 py-4 bg-sacs-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-sacs-900/20 hover:scale-105 transition-all"
          >
            Volver al Inicio
          </button>
        </div>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
