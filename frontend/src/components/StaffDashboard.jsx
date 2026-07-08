import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../hooks/useIncidents';
import ChaosGenerator from './ChaosGenerator';
import ChatBot from './ChatBot';
import IncidentFeed from './IncidentFeed';
import Maps from './Maps';
import StadiumMatrix from './StadiumMatrix';

export default function StaffDashboard() {
  const incidents = useIncidents();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('nodezero_role');
    navigate('/');
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans selection:bg-red-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-red-900/30 pb-6">
          <div className="flex items-center gap-4">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth="1.5" className="animate-[spin_4s_linear_infinite]" strokeDasharray="10 10"/>
              <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2" fill="currentColor" className="animate-pulse" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 drop-shadow-sm">
                NodeZero
              </h1>
              <span className="text-red-400 font-mono text-sm tracking-widest font-bold">STAFF COMMAND CENTER</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 md:mt-0 px-4 py-2 border border-red-900/50 text-red-400 hover:bg-red-900/20 rounded-md font-mono text-sm transition-colors"
          >
            LOGOUT [SECURE]
          </button>
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 2. The Input & Chat: Where unstructured chaos is submitted */}
          <section className="lg:col-span-4 flex flex-col h-full gap-8">
            <ChaosGenerator />
            <ChatBot />
          </section>
          
          {/* 3. The Output: Where structured state is rendered */}
          <section className="lg:col-span-8 flex flex-col h-full gap-8">
            <Maps incidents={incidents} />
            <StadiumMatrix incidents={incidents} />
            <IncidentFeed data={incidents} />
          </section>
        </main>
      </div>
    </div>
  );
}
