import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../hooks/useIncidents';
import ChatBot from './ChatBot';
import Maps from './Maps';
import PublicAlertFeed from './PublicAlertFeed';

export default function FanDashboard() {
  const incidents = useIncidents();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('nodezero_role');
    navigate('/');
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-blue-900/30 pb-6">
          <div className="flex items-center gap-4">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth="1.5" className="animate-[spin_6s_linear_infinite]" strokeDasharray="10 10"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-700 drop-shadow-sm">
                NodeZero
              </h1>
              <span className="text-blue-400 font-mono text-sm tracking-widest font-bold">FAN ASSISTANT & NAVIGATION</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 md:mt-0 px-4 py-2 border border-blue-900/50 text-blue-400 hover:bg-blue-900/20 rounded-md font-mono text-sm transition-colors"
          >
            EXIT STADIUM
          </button>
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Fan Assistance */}
          <section className="lg:col-span-4 flex flex-col h-full gap-8">
            <ChatBot />
            <PublicAlertFeed data={incidents} />
          </section>
          
          {/* Fan Map */}
          <section className="lg:col-span-8 flex flex-col h-full gap-8">
            <Maps incidents={incidents} />
          </section>
        </main>
      </div>
    </div>
  );
}
