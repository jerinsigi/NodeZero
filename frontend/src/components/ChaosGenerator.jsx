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

const PRESETS = [
  { label: 'Crowd Crush', text: "Gate 4 turnstiles are jammed. Fans are piling up outside the security perimeter. There's shouting, we need backup down here immediately." },
  { label: 'Medical/Pyro', text: "Ultras in Section 212 just lit active flares. Smoke is blinding the exit stairs. Someone collapsed from asthma." },
  { label: 'Language Barrier', text: "Issue in concourse 5" },
  { label: 'Accessibility', text: "Elevator 2 is broken near Gate 1. A fan in a wheelchair needs immediate assistance evacuating the section." }
];


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
                signage_routing_override: { type: "STRING" },
                requires_accessibility_support: { type: "BOOLEAN" }
              },
              required: ["severity", "location_node", "summary", "recommended_action", "signage_routing_override", "requires_accessibility_support"]
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
          signage_routing_override: "Proceed to nearest exit",
          requires_accessibility_support: false
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
        requires_accessibility_support: parsed.requires_accessibility_support || false,
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
        <div style={styles.presetContainer}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setText(p.text)}
              style={styles.presetBtn}
              title={p.text}
              disabled={isLoading}
            >
              {p.label}
            </button>
          ))}
        </div>
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
          rows={4}
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
    background:     'rgba(15, 15, 20, 0.6)',
    border:         '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius:   '12px',
    padding:        '20px',
    display:        'flex',
    flexDirection:  'column',
    gap:            '16px',
    backdropFilter: 'blur(16px)',
    boxShadow:      '0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
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
    boxShadow:    '0 0 12px #ef4444',
    flexShrink:   0,
    animation:    'pulse 2s infinite',
  },
  title: {
    margin:      0,
    fontSize:    '15px',
    fontWeight:  800,
    letterSpacing:'0.2em',
    color:       '#f87171',
    fontFamily:  'ui-monospace, Consolas, monospace',
  },
  subtitle: {
    fontSize: '13px',
    color:    '#9ca3af',
    margin:   0,
    lineHeight: '1.6',
    textAlign: 'left',
  },
  form: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '12px',
  },
  presetContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '4px',
  },
  presetBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#d1d5db',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontFamily: 'ui-monospace, Consolas, monospace',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  textarea: {
    background:   'rgba(0, 0, 0, 0.4)',
    border:       '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '10px',
    color:        '#f3f4f6',
    padding:      '12px',
    fontSize:     '13px',
    fontFamily:   'ui-monospace, Consolas, monospace',
    resize:       'vertical',
    outline:      'none',
    transition:   'all 0.3s ease',
    lineHeight:   '1.5',
    minHeight:    '100px',
    boxShadow:    'inset 0 2px 4px rgba(0,0,0,0.5)',
  },
  button: {
    background:    'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
    color:         '#fff',
    border:        '1px solid #f87171',
    borderRadius:  '10px',
    padding:       '12px 16px',
    fontSize:      '13px',
    fontWeight:    700,
    letterSpacing: '0.1em',
    fontFamily:    'ui-monospace, Consolas, monospace',
    transition:    'all 0.2s ease',
    boxShadow:     '0 4px 20px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
    textTransform: 'uppercase',
  },
  spinnerRow: {
    display:    'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  spinner: {
    display:      'inline-block',
    width:        '16px',
    height:       '16px',
    border:       '2px solid rgba(255,255,255,0.3)',
    borderTop:    '2px solid #fff',
    borderRadius: '50%',
    animation:    'nz-spin 0.7s linear infinite',
  },
  feedback: {
    borderRadius: '10px',
    padding:      '12px 16px',
    fontSize:     '13px',
    fontFamily:   'ui-monospace, Consolas, monospace',
    textAlign:    'left',
    fontWeight:   600,
  },
  feedbackSuccess: {
    background: 'rgba(34,197,94,0.1)',
    border:     '1px solid rgba(34,197,94,0.3)',
    color:      '#86efac',
    boxShadow:  '0 0 10px rgba(34,197,94,0.1)',
  },
  feedbackError: {
    background: 'rgba(239,68,68,0.1)',
    border:     '1px solid rgba(239,68,68,0.3)',
    color:      '#fca5a5',
    boxShadow:  '0 0 10px rgba(239,68,68,0.1)',
  },
  legend: {
    display:    'flex',
    gap:        '20px',
    marginTop:  'auto',
    paddingTop: '8px',
    borderTop:  '1px solid rgba(255,255,255,0.05)',
  },
  legendItem: {
    display:    'flex',
    alignItems: 'center',
    gap:        '8px',
    fontSize:   '11px',
    color:      '#9ca3af',
    fontFamily: 'ui-monospace, Consolas, monospace',
    letterSpacing: '0.08em',
    fontWeight: 600,
  },
  legendDot: {
    width:        '8px',
    height:       '8px',
    borderRadius: '50%',
    flexShrink:   0,
    boxShadow:    '0 0 8px currentColor',
  },
};
