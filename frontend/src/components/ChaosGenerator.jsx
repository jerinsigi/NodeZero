import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are a stadium security synthesis engine. Extract facts and output strict JSON. If a location or action is unknown, use 'TBD'.`;

// Severity → style mapping
const SEVERITY_STYLES = {
  high:   { ring: '#ef4444', label: 'bg-red-600',    text: 'HIGH' },
  medium: { ring: '#f59e0b', label: 'bg-amber-500',  text: 'MED'  },
  low:    { ring: '#22c55e', label: 'bg-green-600',  text: 'LOW'  },
};

export default function ChaosGenerator() {
  const [text, setText]         = useState('');
  const [status, setStatus]     = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      // ── 1. Call Gemini 2.5 Flash Lite ─────────────────────────────────────────
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: "OBJECT",
              properties: {
                severity: { type: "STRING", enum: ["high", "medium", "low"] },
                location_node: { type: "STRING" },
                summary: { type: "STRING" },
                recommended_action: { 
                  type: "STRING", 
                  enum: ["dispatch_security", "dispatch_medical", "reroute_traffic", "monitor"] 
                },
                signage_routing_override: { type: "STRING" }
              },
              required: ["severity", "location_node", "summary", "recommended_action", "signage_routing_override"]
            }
          },
        }),
      });

      if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

      const data = await response.json();
      
      let parsed;
      // ── 2. Safety Triggers & Extraction ───────────────────────────────────────
      if (!data.candidates || data.candidates.length === 0) {
        // Fallback protocol (Graceful Degraded State)
        parsed = {
          severity: "high",
          location_node: "SYSTEM_GATEWAY",
          summary: "AI processing pipeline threshold exceeded or blocked.",
          recommended_action: "monitor",
          signage_routing_override: "Proceed to nearest exit"
        };
      } else {
        const raw = data.candidates[0].content.parts[0].text;
        parsed = JSON.parse(raw);
      }

      // ── 3. Write to Firestore `incidents` collection ───────────────────────
      await addDoc(collection(db, 'incidents'), {
        severity:                 parsed.severity                 || 'low',
        location_node:            parsed.location_node            || 'TBD',
        summary:                  parsed.summary                  || '',
        recommended_action:       parsed.recommended_action       || 'monitor',
        signage_routing_override: parsed.signage_routing_override || '',
        raw_input:                text,
        timestamp:                serverTimestamp(),
      });

      setStatus('success');
      setText('');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
      setStatus('error');
    }
  }

  const isLoading = status === 'loading';

  return (
    <div style={styles.card}>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={styles.header}>
        <span style={styles.dot} />
        <h2 style={styles.title}>CHAOS INPUT</h2>
      </div>
      <p style={styles.subtitle}>
        Paste raw radio chatter, panic text, or any unstructured report.
        Gemini will synthesize it into a tactical incident.
      </p>

      {/* ── Textarea ──────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          id="chaos-input"
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={isLoading}
          placeholder={`Example:\n"fight breaking out near section C gate 3 people screaming security needed NOW"`}
          style={{
            ...styles.textarea,
            opacity: isLoading ? 0.6 : 1,
          }}
          rows={7}
        />

        {/* ── Submit ──────────────────────────────────────────────────────── */}
        <button
          id="synthesize-btn"
          type="submit"
          disabled={isLoading || !text.trim()}
          style={{
            ...styles.button,
            opacity: isLoading || !text.trim() ? 0.5 : 1,
            cursor:  isLoading || !text.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? (
            <span style={styles.spinnerRow}>
              <Spinner /> SYNTHESIZING…
            </span>
          ) : (
            '⚡ SYNTHESIZE INCIDENT'
          )}
        </button>
      </form>

      {/* ── Status feedback ───────────────────────────────────────────────── */}
      {status === 'success' && (
        <div style={{ ...styles.feedback, ...styles.feedbackSuccess }}>
          ✅ Incident written to command dashboard.
        </div>
      )}
      {status === 'error' && (
        <div style={{ ...styles.feedback, ...styles.feedbackError }}>
          ❌ {errorMsg}
        </div>
      )}

      {/* ── Severity legend ───────────────────────────────────────────────── */}
      <div style={styles.legend}>
        {Object.entries(SEVERITY_STYLES).map(([sev, { ring, text: lbl }]) => (
          <span key={sev} style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: ring }} />
            {lbl}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Inline spinner ─────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <span style={styles.spinner}>
      <style>{`
        @keyframes nz-spin { to { transform: rotate(360deg); } }
      `}</style>
    </span>
  );
}

// ── Styles (JS-in-CSS so no Tailwind dependency on new components) ─────────────
const styles = {
  card: {
    background:   'rgba(255,255,255,0.03)',
    border:       '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding:      '24px',
    display:      'flex',
    flexDirection:'column',
    gap:          '16px',
    backdropFilter: 'blur(8px)',
  },
  header: {
    display:    'flex',
    alignItems: 'center',
    gap:        '10px',
  },
  dot: {
    width:        '10px',
    height:       '10px',
    borderRadius: '50%',
    background:   '#ef4444',
    boxShadow:    '0 0 8px #ef4444',
    flexShrink:   0,
  },
  title: {
    margin:      0,
    fontSize:    '13px',
    fontWeight:  700,
    letterSpacing:'0.15em',
    color:       '#ef4444',
    fontFamily:  'ui-monospace, Consolas, monospace',
  },
  subtitle: {
    fontSize: '13px',
    color:    '#6b7280',
    margin:   0,
    lineHeight: '1.5',
    textAlign: 'left',
  },
  form: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '12px',
  },
  textarea: {
    background:   'rgba(0,0,0,0.3)',
    border:       '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color:        '#e5e7eb',
    padding:      '14px',
    fontSize:     '14px',
    fontFamily:   'ui-monospace, Consolas, monospace',
    resize:       'vertical',
    outline:      'none',
    transition:   'border-color 0.2s',
    lineHeight:   '1.6',
  },
  button: {
    background:    'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
    color:         '#fff',
    border:        'none',
    borderRadius:  '8px',
    padding:       '13px 20px',
    fontSize:      '13px',
    fontWeight:    700,
    letterSpacing: '0.1em',
    fontFamily:    'ui-monospace, Consolas, monospace',
    transition:    'transform 0.1s, box-shadow 0.2s',
    boxShadow:     '0 4px 15px rgba(220,38,38,0.4)',
  },
  spinnerRow: {
    display:    'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    display:      'inline-block',
    width:        '14px',
    height:       '14px',
    border:       '2px solid rgba(255,255,255,0.3)',
    borderTop:    '2px solid #fff',
    borderRadius: '50%',
    animation:    'nz-spin 0.7s linear infinite',
  },
  feedback: {
    borderRadius: '8px',
    padding:      '10px 14px',
    fontSize:     '13px',
    fontFamily:   'ui-monospace, Consolas, monospace',
    textAlign:    'left',
  },
  feedbackSuccess: {
    background: 'rgba(34,197,94,0.1)',
    border:     '1px solid rgba(34,197,94,0.3)',
    color:      '#86efac',
  },
  feedbackError: {
    background: 'rgba(239,68,68,0.1)',
    border:     '1px solid rgba(239,68,68,0.3)',
    color:      '#fca5a5',
  },
  legend: {
    display:    'flex',
    gap:        '16px',
    marginTop:  '4px',
  },
  legendItem: {
    display:    'flex',
    alignItems: 'center',
    gap:        '6px',
    fontSize:   '11px',
    color:      '#6b7280',
    fontFamily: 'ui-monospace, Consolas, monospace',
    letterSpacing: '0.05em',
  },
  legendDot: {
    width:        '8px',
    height:       '8px',
    borderRadius: '50%',
    flexShrink:   0,
  },
};
