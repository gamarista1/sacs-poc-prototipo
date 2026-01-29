
import React from 'react';

const AboutSacs: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Conoce a <span className="text-sacs-500">SACS</span></h1>
        <p className="text-slate-500 font-medium mt-4 italic">
          "Transformando la interoperabilidad clínica en soluciones humanas y eficientes."
        </p>
      </div>

      {/* Main Presentation Section */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-clinical border border-slate-200 overflow-hidden relative">
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 0,
            paddingTop: '55.8342%',
            paddingBottom: 0,
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            borderRadius: '2rem',
            willChange: 'transform',
          }}
          className="border border-slate-100"
        >
          <iframe
            loading="lazy"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              border: 'none',
              padding: 0,
              margin: 0,
            }}
            src="https://www.canva.com/design/DAG_u4Ytaz4/cyG4DmrHltvdeRj8_zXDyw/view?embed"
            allowFullScreen
            title="SACS Telemedicina Presentation"
          ></iframe>
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 px-4">
          <div className="flex items-center space-x-3">
             <div className="w-12 h-12 bg-mint-400/10 rounded-2xl flex items-center justify-center text-sacs-600">
                <span className="text-2xl">✨</span>
             </div>
             <div>
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Interoperabilidad HL7-FHIR</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Estándar internacional de salud</p>
             </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Diseño por Logistic Consulting INC.</p>
            <a 
              href="https://www.canva.com/design/DAG_u4Ytaz4/cyG4DmrHltvdeRj8_zXDyw/view?utm_content=DAG_u4Ytaz4&utm_campaign=designshare&utm_medium=embeds&utm_source=link" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-black text-sacs-500 hover:text-sacs-600 uppercase tracking-widest flex items-center justify-center md:justify-end transition-colors mt-1"
            >
              <span>Abrir en pantalla completa</span>
              <span className="ml-2">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Misión", desc: "Digitalizar la salud con calidez y eficiencia tecnológica, permitiendo que la información fluya sin barreras.", icon: "🎯" },
          { title: "Visión", desc: "Ser el ecosistema líder en interoperabilidad médica regional bajo estándares globales de seguridad.", icon: "🚀" },
          { title: "Valores", desc: "Seguridad, Innovación y Enfoque Humano en cada integración realizada.", icon: "🤝" }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-soft hover:border-sacs-500/30 transition-colors group">
            <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">{item.icon}</span>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">{item.title}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Corporate Contact & Team Section */}
      <section className="space-y-8 pt-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 px-2">
            <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Estructura Corporativa</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">SACS es un producto de Logistic Consulting, INC</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sede Central</p>
                <p className="text-sm font-bold text-slate-700">601 Brickell Key Drive, suite 700</p>
                <p className="text-sm font-bold text-slate-700">Miami, FL 33131</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Luis F Rodriguez */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sacs-500/5 rounded-bl-[80px] group-hover:scale-110 transition-transform"></div>
            <p className="text-[10px] font-black text-sacs-500 uppercase tracking-widest mb-4">Presidente & CEO</p>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Luis F Rodriguez</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">Logistic Consulting, Inc</p>
            
            <div className="mt-8 space-y-3">
               <div className="flex items-center space-x-2 text-slate-500 text-xs">
                  <span className="opacity-50">📞</span>
                  <span className="font-semibold">(786) 999-5928</span>
               </div>
               <div className="flex items-center space-x-2 text-slate-500 text-xs">
                  <span className="opacity-50">🌐</span>
                  <a href="https://www.sacsproducts.com" target="_blank" rel="noreferrer" className="font-semibold text-sacs-500 hover:underline">www.sacsproducts.com</a>
               </div>
            </div>
          </div>

          {/* Gustavo Amarista */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-200 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-mint-400/5 rounded-bl-[80px] group-hover:scale-110 transition-transform"></div>
             <p className="text-[10px] font-black text-mint-500 uppercase tracking-widest mb-4">Arquitectura & Desarrollo</p>
             <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Gustavo Amarista</h3>
             <p className="text-xs font-bold text-slate-400 mt-1">Developer - Consultor</p>
             
             <div className="mt-8 space-y-3">
               <div className="flex items-center space-x-2 text-slate-500 text-xs">
                  <span className="opacity-50">📞</span>
                  <span className="font-semibold">+1 (316) 469-5701</span>
               </div>
               <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">Miami, FL 33131</p>
            </div>
          </div>

          {/* Johanaly Ramirez */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-200 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-sacs-900/5 rounded-bl-[80px] group-hover:scale-110 transition-transform"></div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Gestión de Operaciones</p>
             <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Johanaly Ramirez</h3>
             <p className="text-xs font-bold text-slate-400 mt-1">Manager de Proyecto / Scrum Master</p>
             
             <div className="mt-8 space-y-3">
               <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <span className="opacity-50">📍</span>
                  <span className="font-semibold uppercase tracking-tighter">Brickell Key Drive, Miami</span>
               </div>
               <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <span className="opacity-50">🚀</span>
                  <span className="font-black uppercase text-[10px] tracking-widest text-sacs-500">Agile Delivery</span>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-[2rem] text-center">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Global Clinical Hub v4.0 • Secured by HL7 FHIR Standards</p>
        </div>
      </section>
    </div>
  );
};

export default AboutSacs;
