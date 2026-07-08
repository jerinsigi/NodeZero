import React, { useState } from 'react';

// ── Severity colour config ─────────────────────────────────────────────────────
const SEVERITY = {
  high: {
    border:    'rgba(239,68,68,0.6)',
    glow:      '0 0 20px rgba(239,68,68,0.2)',
    badge:     { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)' },
    dot:       '#ef4444',
    label:     'HIGH',
  },
  medium: {
    border:    'rgba(245,158,11,0.6)',
    glow:      '0 0 20px rgba(245,158,11,0.15)',
    badge:     { background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.4)' },
    dot:       '#f59e0b',
    label:     'MED',
  },
  low: {
    border:    'rgba(34,197,94,0.4)',
    glow:      '0 0 20px rgba(34,197,94,0.1)',
    badge:     { background: 'rgba(34,197,94,0.12)', color: '#86efac', border: '1px solid rgba(34,197,94,0.35)' },
    dot:       '#22c55e',
    label:     'LOW',
  },
};

function formatTime(ts) {
  if (!ts) return '—';
  // Firestore Timestamp or plain number
  const ms = ts?.seconds ? ts.seconds * 1000 : ts;
  return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ── Single incident card ───────────────────────────────────────────────────────
function IncidentCard({ incident }) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY[incident.severity] ?? SEVERITY.low;

  return (
    <article
      style={{
        ...styles.card,
        borderColor: sev.border,
        boxShadow:   sev.glow,
      }}
    >
      {/* Top row: severity badge + location + time */}
      <div style={styles.cardTop}>
        <span style={{ ...styles.badge, ...sev.badge }}>
          <span style={{ ...styles.badgeDot, background: sev.dot }} />
          {sev.label}
        </span>

        <span style={styles.location}>
          📍 {incident.location_node || incident.location || 'TBD'}
        </span>

        <span style={styles.timestamp}>
          {formatTime(incident.timestamp)}
        </span>
      </div>

      {/* Summary of the incident */}
      {incident.summary && (
        <p style={{ ...styles.action, fontWeight: 'bold' }}>
          {incident.summary}
        </p>
      )}

      {/* Recommended action */}
      <p style={styles.action}>
        <strong style={{color: '#9ca3af'}}>ACTION:</strong> {incident.recommended_action || 'No action specified.'}
      </p>

      {/* Signage Override */}
      {incident.signage_routing_override && (
        <p style={styles.action}>
          <strong style={{color: '#9ca3af'}}>SIGNAGE:</strong> {incident.signage_routing_override}
        </p>
      )}

      {/* Raw input — collapsible */}
      <button
        id={`expand-${incident.id}`}
        onClick={() => setExpanded(x => !x)}
        style={styles.expandBtn}
      >
        {expanded ? '▲ Hide raw input' : '▼ Show raw input'}
      </button>

      {expanded && (
        <p style={styles.rawInput}>
          "{incident.raw_input}"
        </p>
      )}
    </article>
  );
}

// ── IncidentFeed (main export) ─────────────────────────────────────────────────
export default function IncidentFeed({ data = [] }) {
  if (data.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>📡</div>
        <p style={styles.emptyTitle}>AWAITING REPORTS</p>
        <p style={styles.emptySubtitle}>
          Submit raw incident text via the Chaos Input panel.<br />
          Synthesized incidents will appear here in real-time.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.feed}>
      {/* Feed header */}
      <div style={styles.feedHeader}>
        <div style={styles.liveRow}>
          <span style={styles.liveDot} />
          <span style={styles.liveLabel}>LIVE FEED</span>
        </div>
        <span style={styles.feedCount}>{data.length} incident{data.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Cards */}
      <div style={styles.cardList}>
        {data.map(incident => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = {
  // Empty state
  empty: {
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    justifyContent:'center',
    gap:           '12px',
    padding:       '60px 24px',
    border:        '1px dashed rgba(255,255,255,0.08)',
    borderRadius:  '12px',
    background:    'rgba(255,255,255,0.02)',
    minHeight:     '300px',
  },
  emptyIcon: {
    fontSize: '40px',
    filter:   'grayscale(1) opacity(0.5)',
  },
  emptyTitle: {
    margin:        0,
    fontSize:      '13px',
    fontWeight:    700,
    letterSpacing: '0.2em',
    color:         '#4b5563',
    fontFamily:    'ui-monospace, Consolas, monospace',
  },
  emptySubtitle: {
    margin:     0,
    fontSize:   '13px',
    color:      '#374151',
    lineHeight: '1.6',
    textAlign:  'center',
  },

  // Feed wrapper
  feed: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '16px',
  },
  feedHeader: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingBottom:  '12px',
    borderBottom:   '1px solid rgba(255,255,255,0.06)',
  },
  liveRow: {
    display:    'flex',
    alignItems: 'center',
    gap:        '8px',
  },
  liveDot: {
    width:        '8px',
    height:       '8px',
    borderRadius: '50%',
    background:   '#22c55e',
    boxShadow:    '0 0 8px #22c55e',
    // pulse animation via style tag in JSX below
  },
  liveLabel: {
    fontSize:      '12px',
    fontWeight:    700,
    letterSpacing: '0.18em',
    color:         '#22c55e',
    fontFamily:    'ui-monospace, Consolas, monospace',
  },
  feedCount: {
    fontSize:   '12px',
    color:      '#4b5563',
    fontFamily: 'ui-monospace, Consolas, monospace',
  },
  cardList: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '12px',
  },

  // Card
  card: {
    background:     'rgba(255,255,255,0.03)',
    border:         '1px solid',
    borderRadius:   '10px',
    padding:        '18px 20px',
    display:        'flex',
    flexDirection:  'column',
    gap:            '10px',
    backdropFilter: 'blur(6px)',
    transition:     'box-shadow 0.3s',
  },
  cardTop: {
    display:    'flex',
    alignItems: 'center',
    gap:        '10px',
    flexWrap:   'wrap',
  },
  badge: {
    display:      'flex',
    alignItems:   'center',
    gap:          '6px',
    padding:      '3px 10px',
    borderRadius: '20px',
    fontSize:     '11px',
    fontWeight:   700,
    letterSpacing:'0.12em',
    fontFamily:   'ui-monospace, Consolas, monospace',
  },
  badgeDot: {
    width:        '6px',
    height:       '6px',
    borderRadius: '50%',
    flexShrink:   0,
  },
  location: {
    flex:       1,
    fontSize:   '13px',
    color:      '#9ca3af',
    fontFamily: 'ui-monospace, Consolas, monospace',
    textAlign:  'left',
  },
  timestamp: {
    fontSize:   '11px',
    color:      '#4b5563',
    fontFamily: 'ui-monospace, Consolas, monospace',
    whiteSpace: 'nowrap',
  },
  action: {
    margin:     0,
    fontSize:   '14px',
    color:      '#e5e7eb',
    lineHeight: '1.55',
    textAlign:  'left',
  },
  expandBtn: {
    background:    'none',
    border:        'none',
    color:         '#4b5563',
    fontSize:      '11px',
    cursor:        'pointer',
    padding:       0,
    fontFamily:    'ui-monospace, Consolas, monospace',
    letterSpacing: '0.05em',
    textAlign:     'left',
    transition:    'color 0.2s',
  },
  rawInput: {
    margin:       0,
    fontSize:     '12px',
    color:        '#6b7280',
    fontFamily:   'ui-monospace, Consolas, monospace',
    fontStyle:    'italic',
    lineHeight:   '1.5',
    background:   'rgba(0,0,0,0.2)',
    borderRadius: '6px',
    padding:      '10px 12px',
    textAlign:    'left',
  },
};
