import React from 'react';
import { useIncidents } from './hooks/useIncidents';
import ChaosGenerator from './components/ChaosGenerator';
import IncidentFeed from './components/IncidentFeed';
import StadiumMatrix from './components/StadiumMatrix';

export default function App() {
  // 1. Hook into the live database. 
  // App.jsx does not care where this data came from or how Gemini parsed it.
  const incidents = useIncidents();

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans selection:bg-red-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-red-900/30 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight  text-transparent bg-gradient-to-r from-red-500 to-red-800 drop-shadow-sm ">
              NodeZero
            </h1>
          </div>
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 2. The Input: Where unstructured chaos is submitted */}
          <section className="lg:col-span-4 flex-col h-full">
            <ChaosGenerator />
          </section>
          
          {/* 3. The Output: Where structured state is rendered */}
          <section className="lg:col-span-8 flex flex-col h-full gap-8">
            <StadiumMatrix incidents={incidents} />
            <IncidentFeed data={incidents} />
          </section>
        </main>
      </div>
    </div>
  );
}