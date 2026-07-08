import React, { useMemo, useState } from 'react';

const PREDEFINED_ZONES = [
  'GATE_01', 'GATE_02', 'GATE_03', 'GATE_04',
  'CONCOURSE_N', 'CONCOURSE_S', 'CONCOURSE_05',
  'SEC_101', 'SEC_102', 'SEC_103', 'SEC_104',
  'VIP_LOUNGE', 'PITCH'
];

export default function Maps({ incidents = [] }) {
  const [hoveredZone, setHoveredZone] = useState(null);

  const zoneStatus = useMemo(() => {
    const statusMap = {};
    const severityRank = { high: 3, medium: 2, low: 1 };
    
    incidents.forEach(inc => {
      let node = inc.location_node ? inc.location_node.toUpperCase().replace(/\s+/g, '_') : 'UNKNOWN';
      // Normalize single digit gates like GATE_1 to GATE_01
      node = node.replace(/^GATE_(\d)$/, 'GATE_0$1');
      // Normalize SECTION_ to SEC_
      node = node.replace(/^SECTION_/, 'SEC_');
      // Normalize CONCOURSE numbers
      node = node.replace(/^CONCOURSE_(\d)$/, 'CONCOURSE_0$1');
      // Normalize VIP variations to VIP_LOUNGE
      if (node.startsWith('VIP')) node = 'VIP_LOUNGE';
      // Normalize FIELD to PITCH
      if (node.includes('FIELD')) node = 'PITCH';
      
      const currentRank = statusMap[node] ? severityRank[statusMap[node]] : 0;
      const severityStr = inc.severity ? inc.severity.toLowerCase() : 'low';
      const incRank = severityRank[severityStr] || 1;
      
      if (incRank > currentRank) {
        statusMap[node] = severityStr;
      }
    });
    return statusMap;
  }, [incidents]);

  // Helper to determine style based on status
  const getStyle = (zoneId, isStroke = false) => {
    const status = zoneStatus[zoneId];
    let color = 'rgba(255, 255, 255, 0.1)';
    let filter = 'none';
    let pulse = false;

    if (status === 'high') {
      color = 'rgba(239, 68, 68, 0.8)'; // Red
      filter = 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))';
      pulse = true;
    } else if (status === 'medium') {
      color = 'rgba(245, 158, 11, 0.8)'; // Amber
      filter = 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))';
    } else if (status === 'low') {
      color = 'rgba(34, 197, 94, 0.8)'; // Green
      filter = 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.4))';
    } else if (hoveredZone === zoneId) {
      color = 'rgba(255, 255, 255, 0.25)';
    }

    return {
      fill: isStroke ? 'none' : color,
      stroke: isStroke ? color : 'rgba(255,255,255,0.2)',
      filter,
      animation: pulse ? 'pulse 2s infinite' : 'none',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    };
  };

  const activeDynamicZones = useMemo(() => {
    return Object.keys(zoneStatus).filter(k => k !== 'UNKNOWN' && !PREDEFINED_ZONES.includes(k));
  }, [zoneStatus]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.liveRow}>
          <span style={styles.liveDot} />
          <h2 style={styles.title}>LIVE CROWD & INCIDENT OVERLAY</h2>
        </div>
        {hoveredZone && (
          <div style={styles.tooltip}>
            {hoveredZone.replace(/_/g, ' ')}
            {zoneStatus[hoveredZone] && <span style={styles.tooltipStatus(zoneStatus[hoveredZone])}>{zoneStatus[hoveredZone].toUpperCase()}</span>}
          </div>
        )}
      </div>

      <div style={styles.mapWrapper}>
        <svg viewBox="0 0 800 600" style={styles.svg}>
          <defs>
            <radialGradient id="pitchGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.15)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
            </radialGradient>
          </defs>

          {/* Background Ambient Glow */}
          <rect x="200" y="150" width="400" height="300" fill="url(#pitchGlow)" pointerEvents="none" />

          {/* ── CONCOURSES (Outer Rings) ── */}
          {/* North Concourse */}
          <path 
            d="M 120 300 A 280 200 0 0 1 680 300" 
            {...getStyle('CONCOURSE_N', true)} 
            strokeWidth="16" strokeLinecap="round" strokeDasharray="10 15"
            onMouseEnter={() => setHoveredZone('CONCOURSE_N')} onMouseLeave={() => setHoveredZone(null)}
          />
          {/* South Concourse */}
          <path 
            d="M 120 300 A 280 200 0 0 0 680 300" 
            {...getStyle('CONCOURSE_S', true)} 
            strokeWidth="16" strokeLinecap="round" strokeDasharray="10 15"
            onMouseEnter={() => setHoveredZone('CONCOURSE_S')} onMouseLeave={() => setHoveredZone(null)}
          />

          {/* ── SECTIONS (Stands) ── */}
          {/* SEC 101 (North) */}
          <path 
            d="M 260 160 Q 400 80 540 160" 
            {...getStyle('SEC_101', true)} 
            strokeWidth="45" strokeLinecap="round"
            onMouseEnter={() => setHoveredZone('SEC_101')} onMouseLeave={() => setHoveredZone(null)}
          />
          {/* SEC 103 (South) */}
          <path 
            d="M 260 440 Q 400 520 540 440" 
            {...getStyle('SEC_103', true)} 
            strokeWidth="45" strokeLinecap="round"
            onMouseEnter={() => setHoveredZone('SEC_103')} onMouseLeave={() => setHoveredZone(null)}
          />
          {/* SEC 104 (West) */}
          <path 
            d="M 190 220 Q 140 300 190 380" 
            {...getStyle('SEC_104', true)} 
            strokeWidth="35" strokeLinecap="round"
            onMouseEnter={() => setHoveredZone('SEC_104')} onMouseLeave={() => setHoveredZone(null)}
          />
          {/* SEC 102 (East) */}
          <path 
            d="M 610 220 Q 660 300 610 380" 
            {...getStyle('SEC_102', true)} 
            strokeWidth="35" strokeLinecap="round"
            onMouseEnter={() => setHoveredZone('SEC_102')} onMouseLeave={() => setHoveredZone(null)}
          />

          {/* ── GATES (Corners) ── */}
          <g>
            <circle cx="210" cy="170" r="22" {...getStyle('GATE_01')} onMouseEnter={() => setHoveredZone('GATE_01')} onMouseLeave={() => setHoveredZone(null)} />
            <text x="210" y="174" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold" pointerEvents="none">G1</text>
            
            <circle cx="590" cy="170" r="22" {...getStyle('GATE_02')} onMouseEnter={() => setHoveredZone('GATE_02')} onMouseLeave={() => setHoveredZone(null)} />
            <text x="590" y="174" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold" pointerEvents="none">G2</text>
            
            <circle cx="590" cy="430" r="22" {...getStyle('GATE_03')} onMouseEnter={() => setHoveredZone('GATE_03')} onMouseLeave={() => setHoveredZone(null)} />
            <text x="590" y="434" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold" pointerEvents="none">G3</text>
            
            <circle cx="210" cy="430" r="22" {...getStyle('GATE_04')} onMouseEnter={() => setHoveredZone('GATE_04')} onMouseLeave={() => setHoveredZone(null)} />
            <text x="210" y="434" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold" pointerEvents="none">G4</text>
          </g>

          {/* ── PITCH (Center) ── */}
          <g 
            onMouseEnter={() => setHoveredZone('PITCH')} 
            onMouseLeave={() => setHoveredZone(null)}
            style={{cursor: 'pointer'}}
          >
            <rect x="280" y="210" width="240" height="180" rx="6" fill="rgba(34,197,94,0.05)" stroke={zoneStatus['PITCH'] ? getStyle('PITCH', true).stroke : "rgba(34,197,94,0.3)"} strokeWidth="2" filter={getStyle('PITCH').filter} />
            <circle cx="400" cy="300" r="30" fill="none" stroke="rgba(34,197,94,0.2)" strokeWidth="2" />
            <line x1="400" y1="210" x2="400" y2="390" stroke="rgba(34,197,94,0.2)" strokeWidth="2" />
            <rect x="280" y="250" width="30" height="100" fill="none" stroke="rgba(34,197,94,0.2)" strokeWidth="2" />
            <rect x="490" y="250" width="30" height="100" fill="none" stroke="rgba(34,197,94,0.2)" strokeWidth="2" />
          </g>
          
        </svg>
      </div>

      {/* Dynamic unmapped zones fallback (e.g. VIP_LOUNGE, CONCOURSE_05 if not drawn in SVG explicitly) */}
      {activeDynamicZones.length > 0 && (
        <div style={styles.dynamicContainer}>
          <h4 style={styles.dynamicTitle}>OTHER ACTIVE ZONES:</h4>
          <div className="flex flex-wrap gap-2">
            {activeDynamicZones.map(zone => {
              const status = zoneStatus[zone];
              let bgClass = "bg-black/30 border-gray-700/50 text-gray-400";
              let pulseClass = "";
              if (status === 'high') {
                bgClass = "bg-red-900/40 border-red-500 text-red-100 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
                pulseClass = "animate-pulse";
              } else if (status === 'medium') {
                bgClass = "bg-amber-900/40 border-amber-500 text-amber-100";
              } else if (status === 'low') {
                bgClass = "bg-green-900/30 border-green-500 text-green-100";
              }
              return (
                <div key={zone} className={`px-3 py-1 border rounded-md text-xs font-mono font-bold ${bgClass} ${pulseClass}`}>
                  {zone.replace(/_/g, ' ')}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(10, 10, 14, 0.7)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '24px',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '16px',
  },
  liveRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  liveDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#38bdf8',
    boxShadow: '0 0 12px #38bdf8',
    animation: 'pulse 2s infinite',
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 800,
    letterSpacing: '0.15em',
    color: '#e0f2fe',
    fontFamily: 'ui-monospace, Consolas, monospace',
  },
  tooltip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontFamily: 'ui-monospace, Consolas, monospace',
    fontWeight: 'bold',
    color: '#fff',
  },
  tooltipStatus: (status) => ({
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '10px',
    background: status === 'high' ? 'rgba(239,68,68,0.2)' : status === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)',
    color: status === 'high' ? '#fca5a5' : status === 'medium' ? '#fcd34d' : '#86efac',
    border: `1px solid ${status === 'high' ? '#ef4444' : status === 'medium' ? '#f59e0b' : '#22c55e'}`,
  }),
  mapWrapper: {
    width: '100%',
    aspectRatio: '4/3',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'radial-gradient(circle at center, rgba(30,41,59,0.3) 0%, rgba(0,0,0,0) 70%)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  svg: {
    width: '100%',
    height: '100%',
    filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))',
  },
  dynamicContainer: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  dynamicTitle: {
    margin: '0 0 10px 0',
    fontSize: '12px',
    color: '#9ca3af',
    fontFamily: 'ui-monospace, Consolas, monospace',
    letterSpacing: '0.1em',
  },
};
