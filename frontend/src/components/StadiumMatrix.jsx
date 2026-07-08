import React, { useMemo } from 'react';

const PREDEFINED_ZONES = [
  'GATE_01', 'GATE_02', 'GATE_03', 'GATE_04',
  'CONCOURSE_N', 'CONCOURSE_S',
  'SEC_101', 'SEC_102', 'SEC_103', 'SEC_104',
  'VIP_LOUNGE', 'PITCH'
];

export default function StadiumMatrix({ incidents = [] }) {
  // Map out zones to their highest severity status
  const zoneStatus = useMemo(() => {
    const statusMap = {};
    const severityRank = { high: 3, medium: 2, low: 1 };
    
    incidents.forEach(inc => {
      let node = inc.location_node ? inc.location_node.toUpperCase().replace(/\s+/g, '_') : 'UNKNOWN';
      // Normalize single digit gates like GATE_1 to GATE_01
      node = node.replace(/^GATE_(\d)$/, 'GATE_0$1');
      
      const currentRank = statusMap[node] ? severityRank[statusMap[node]] : 0;
      const incRank = severityRank[inc.severity] || 0;
      
      if (incRank > currentRank) {
        statusMap[node] = inc.severity;
      }
    });
    return statusMap;
  }, [incidents]);

  // Combine predefined zones with any new dynamically discovered zones
  const activeZonesSet = new Set(PREDEFINED_ZONES);
  Object.keys(zoneStatus).forEach(k => {
    if (k !== 'UNKNOWN') activeZonesSet.add(k);
  });
  
  const zonesToRender = Array.from(activeZonesSet);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.liveDot} />
        <h2 style={styles.title}>VISUAL TWIN: TACTICAL MATRIX</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
        {zonesToRender.map(zone => {
          const status = zoneStatus[zone];
          let bgClass = "bg-black/30 border-gray-700/50 text-gray-500";
          let pulseClass = "";
          let dotColor = "bg-gray-700";
          
          if (status === 'high') {
             bgClass = "bg-red-900/40 border-red-500 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
             pulseClass = "animate-pulse";
             dotColor = "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]";
          } else if (status === 'medium') {
             bgClass = "bg-amber-900/40 border-amber-500/80 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.2)]";
             dotColor = "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,1)]";
          } else if (status === 'low') {
             bgClass = "bg-green-900/30 border-green-500/60 text-green-100";
             dotColor = "bg-green-500";
          }

          return (
            <div key={zone} className={`flex flex-col items-center justify-center p-3 border rounded-xl backdrop-blur-md transition-all duration-300 ${bgClass} ${pulseClass}`}>
              <div className={`w-3 h-3 rounded-full mb-2 ${dotColor}`}></div>
              <span className="text-[11px] font-mono font-bold tracking-wider text-center break-words w-full">
                {zone.replace(/_/g, ' ')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(15, 15, 20, 0.4)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '20px',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  liveDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#8b5cf6',
    boxShadow: '0 0 12px #8b5cf6',
    animation: 'pulse 2s infinite',
  },
  title: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 800,
    letterSpacing: '0.2em',
    color: '#c4b5fd',
    fontFamily: 'ui-monospace, Consolas, monospace',
  },
};
