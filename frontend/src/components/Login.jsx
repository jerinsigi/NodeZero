import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [ticketInput, setTicketInput] = useState('');
  const [staffInput, setStaffInput] = useState('');
  
  const handleFanLogin = (e) => {
    e.preventDefault();
    if (ticketInput.trim()) {
      localStorage.setItem('nodezero_role', 'fan');
      navigate('/fan');
    }
  };

  const handleStaffLogin = (e) => {
    e.preventDefault();
    if (staffInput.trim()) {
      localStorage.setItem('nodezero_role', 'staff');
      navigate('/staff');
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Graphic */}
      <div style={styles.bgGlow} />

      {/* Header Logo */}
      <header style={styles.header}>
        <div style={styles.logoWrapper}>
          <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth="1.5" className="animate-[spin_4s_linear_infinite]" strokeDasharray="10 10"/>
            <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="2" fill="currentColor" className="animate-pulse" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
          <h1 style={styles.title}>NodeZero</h1>
        </div>
        <p style={styles.subtitle}>STADIUM OPERATIONS INTELLIGENCE CENTER</p>
      </header>

      {/* Login Panels */}
      <div style={styles.panelGrid}>
        
        {/* Fan Portal */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={{...styles.dot, background: '#3b82f6', boxShadow: '0 0 12px #3b82f6'}} />
            <h2 style={{...styles.cardTitle, color: '#93c5fd'}}>FAN PORTAL</h2>
          </div>
          <p style={styles.description}>Access live stadium navigation, event updates, and the NodeZero Fan Assistant. <br/> Use a for demo </p>
          <form onSubmit={handleFanLogin} style={styles.form}>
            <input 
              type="text" 
              placeholder="Enter Ticket Number (e.g. TKT-992)" 
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={{...styles.button, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', borderColor: '#60a5fa'}}>
              ENTER STADIUM
            </button>
          </form>
        </div>

        {/* Staff Portal */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={{...styles.dot, background: '#ef4444', boxShadow: '0 0 12px #ef4444'}} />
            <h2 style={{...styles.cardTitle, color: '#fca5a5'}}>COMMAND CENTER</h2>
          </div>
          <p style={styles.description}>Secure access to live incident feeds, chaos simulation, and tactical visual twin. <br/> Use b for demo </p>
          <form onSubmit={handleStaffLogin} style={styles.form}>
            <input 
              type="password" 
              placeholder="Enter Staff Badge ID (e.g. SEC-001)" 
              value={staffInput}
              onChange={(e) => setStaffInput(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={{...styles.button, background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', borderColor: '#f87171'}}>
              SECURE LOGIN
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  bgGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, rgba(0,0,0,0) 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
    zIndex: 1,
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '12px',
  },
  icon: {
    width: '60px',
    height: '60px',
    color: '#ef4444',
  },
  title: {
    margin: 0,
    fontSize: '64px',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: 'transparent',
    backgroundImage: 'linear-gradient(to right, #ef4444, #991b1b)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
  },
  subtitle: {
    margin: 0,
    color: '#9ca3af',
    fontSize: '14px',
    letterSpacing: '0.3em',
    fontFamily: 'ui-monospace, Consolas, monospace',
    fontWeight: 600,
  },
  panelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '32px',
    width: '100%',
    maxWidth: '800px',
    zIndex: 1,
  },
  card: {
    background: 'rgba(15, 15, 20, 0.6)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '32px',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  cardTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 800,
    letterSpacing: '0.15em',
    fontFamily: 'ui-monospace, Consolas, monospace',
  },
  description: {
    color: '#9ca3af',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: 'auto',
  },
  input: {
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#f3f4f6',
    padding: '14px 16px',
    fontSize: '14px',
    fontFamily: 'ui-monospace, Consolas, monospace',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    color: '#fff',
    border: '1px solid',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    fontFamily: 'ui-monospace, Consolas, monospace',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  }
};
