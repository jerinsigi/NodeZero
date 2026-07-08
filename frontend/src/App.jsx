import React from 'react';
import { useIncidents } from './hooks/useIncidents';
import ChaosGenerator from './components/ChaosGenerator';
import IncidentFeed from './components/IncidentFeed';

export default function App() {
  // 1. Hook into the live database. 
  // App.jsx does not care where this data came from or how Gemini parsed it.
  const incidents = useIncidents();

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <header className="mb-8 border-b border-neutral-700 pb-4">
        <h1 className="text-3xl font-bold tracking-wider text-red-500">NODEZERO</h1>
        <p className="text-neutral-400 text-sm">Tactical Synthesis Copilot // LIVE</p>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. The Input: Where unstructured chaos is submitted */}
        <section className="lg:col-span-1">
          <ChaosGenerator />
        </section>
        
        {/* 3. The Output: Where structured state is rendered */}
        <section className="lg:col-span-2">
          <IncidentFeed data={incidents} />
        </section>
      </main>
    </div>
  );
}