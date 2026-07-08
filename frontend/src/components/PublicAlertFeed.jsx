import React from 'react';

function formatTime(ts) {
  if (!ts) return '—';
  const ms = ts?.seconds ? ts.seconds * 1000 : ts;
  return new Date(ms).toLocaleString([], { 
    hour: '2-digit', minute: '2-digit'
  });
}

export default function PublicAlertFeed({ data = [] }) {
  // Only show high or medium severity for public alerts, and maybe low if relevant, 
  // but let's show all of them just without the internal routing / raw inputs.
  const alerts = data;

  if (alerts.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>✓</div>
        <p style={styles.emptyTitle}>ALL CLEAR</p>
        <p style={styles.emptySubtitle}>No active delays or incidents reported.</p>
      </div>
    );
  }

  return (
    <div style={styles.feed}>
      <div style={styles.feedHeader}>
        <div style={styles.liveRow}>
          <span style={styles.liveDot} />
          <span style={styles.liveLabel}>STADIUM ALERTS</span>
        </div>
      </div>

      <div style={styles.cardList}>
        {alerts.map(incident => (
          <article key={incident.id} style={styles.card}>
            <div style={styles.cardTop}>
              <span style={styles.location}>
                📍 {incident.location_node || incident.location || 'TBD'}
              </span>
              <span style={styles.timestamp}>
                {formatTime(incident.timestamp)}
              </span>
            </div>
            
            {/* Display the synthesized summary for the public, not the raw input */}
            <p style={styles.action}>
              {incident.summary || 'Operational update in progress.'}
            </p>

            {/* If there's an override, show it prominently for fans */}
            {incident.signage_routing_override && (
              <div style={styles.routing}>
                <strong>⚠️ FAN ADVISORY:</strong> {incident.signage_routing_override}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

const styles = {
  empty: {
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    justifyContent:'center',
    gap:           '8px',
    padding:       '30px 20px',
    border:        '1px dashed rgba(59,130,246,0.2)',
    borderRadius:  '12px',
    background:    'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(8px)',
  },
  emptyIcon: {
    fontSize: '24px',
    color: '#60a5fa',
    marginBottom: '4px',
  },
  emptyTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 800,
    letterSpacing: '0.15em',
    color: '#93c5fd',
    fontFamily: 'ui-monospace, Consolas, monospace',
  },
  emptySubtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#9ca3af',
  },
  feed: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '12px',
    background:    'rgba(15, 15, 20, 0.4)',
    border:        '1px solid rgba(59,130,246,0.1)',
    borderRadius:  '12px',
    padding:       '16px',
    backdropFilter: 'blur(16px)',
  },
  feedHeader: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingBottom:  '12px',
    borderBottom:   '1px solid rgba(59,130,246,0.1)',
  },
  liveRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#3b82f6',
    boxShadow: '0 0 12px #3b82f6',
    animation: 'pulse 2s infinite',
  },
  liveLabel: {
    fontSize: '14px',
    fontWeight: 800,
    letterSpacing: '0.1em',
    color: '#60a5fa',
    fontFamily: 'ui-monospace, Consolas, monospace',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  card: {
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '8px',
    marginBottom: '4px',
  },
  location: {
    fontSize: '14px',
    color: '#d1d5db',
    fontWeight: 'bold',
    fontFamily: 'ui-monospace, Consolas, monospace',
  },
  timestamp: {
    fontSize: '12px',
    color: '#6b7280',
    fontFamily: 'ui-monospace, Consolas, monospace',
  },
  action: {
    margin: 0,
    fontSize: '14px',
    color: '#e5e7eb',
    lineHeight: '1.5',
  },
  routing: {
    marginTop: '8px',
    padding: '10px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '6px',
    color: '#fca5a5',
    fontSize: '13px',
    fontWeight: 'bold',
  }
};
