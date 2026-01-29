
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  isPositive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, isPositive = true }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-200 hover:border-sacs-500/30 transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sacs-500/5 to-transparent rounded-bl-[100px] pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-sacs-50 rounded-xl flex items-center justify-center text-sacs-500 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {trend && (
          <div className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {isPositive ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
