import React, { useState, useRef, useEffect } from 'react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are the NodeZero AI Assistant, an intelligent stadium operations bot. You help staff with stadium layouts, crowd control protocols, operational guides, and directions. Keep your answers concise, professional, and helpful.`;

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'NodeZero AI online. How can I assist with stadium operations today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for Gemini (excluding the initial greeting if it doesn't strictly follow user/model alternation rules, but Gemini allows a leading model message, though usually it starts with user. Let's just build it safely).
      const contents = newMessages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));
      
      // Ensure the first message is 'user' for strict Gemini chat formatting if needed, but it usually handles it.
      // Wait, Gemini strict chat requires the first message to be from 'user'. Let's slice if first is 'model'.
      let validContents = [...contents];
      if (validContents.length > 0 && validContents[0].role === 'model') {
        validContents = validContents.slice(1);
      }

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: validContents,
        }),
      });

      if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble processing that right now.";

      setMessages(prev => [...prev, { role: 'model', text: botResponse }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "❌ Connection error. Unable to reach NodeZero network." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.dot} />
        <h2 style={styles.title}>AI ASSISTANT</h2>
      </div>

      <div style={styles.chatArea}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            ...styles.messageWrapper,
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              ...styles.bubble,
              ...(msg.role === 'user' ? styles.userBubble : styles.modelBubble)
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ ...styles.messageWrapper, justifyContent: 'flex-start' }}>
            <div style={{ ...styles.bubble, ...styles.modelBubble, ...styles.loadingBubble }}>
              <Spinner /> Processing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask for directions, protocols..."
          style={styles.input}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()} style={styles.sendButton}>
          SEND
        </button>
      </form>
    </div>
  );
}

function Spinner() {
  return (
    <span style={styles.spinner}>
      <style>{`
        @keyframes nz-spin { to { transform: rotate(360deg); } }
      `}</style>
    </span>
  );
}

const styles = {
  card: {
    background: 'rgba(15, 15, 20, 0.6)',
    border: '1px solid rgba(56, 189, 248, 0.15)', // Blue-ish theme for AI
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    height: '400px', // Fixed height so it scrolls
    backdropFilter: 'blur(16px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    marginBottom: '12px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#38bdf8',
    boxShadow: '0 0 12px #38bdf8',
    animation: 'pulse 2s infinite',
  },
  title: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 800,
    letterSpacing: '0.2em',
    color: '#7dd3fc',
    fontFamily: 'ui-monospace, Consolas, monospace',
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingRight: '4px',
    marginBottom: '12px',
  },
  messageWrapper: {
    display: 'flex',
    width: '100%',
  },
  bubble: {
    maxWidth: '85%',
    padding: '10px 14px',
    borderRadius: '12px',
    fontSize: '13px',
    lineHeight: '1.5',
    fontFamily: 'ui-monospace, Consolas, monospace',
  },
  userBubble: {
    background: 'rgba(56, 189, 248, 0.15)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    color: '#bae6fd',
    borderBottomRightRadius: '2px',
  },
  modelBubble: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#e5e7eb',
    borderBottomLeftRadius: '2px',
  },
  loadingBubble: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#9ca3af',
  },
  form: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(56, 189, 248, 0.2)',
    borderRadius: '8px',
    color: '#f3f4f6',
    padding: '10px 12px',
    fontSize: '13px',
    fontFamily: 'ui-monospace, Consolas, monospace',
    outline: 'none',
  },
  sendButton: {
    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    color: '#fff',
    border: '1px solid #38bdf8',
    borderRadius: '8px',
    padding: '0 16px',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    fontFamily: 'ui-monospace, Consolas, monospace',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  spinner: {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'nz-spin 0.7s linear infinite',
  },
};
