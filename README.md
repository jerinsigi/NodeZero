# NodeZero // Tactical Synthesis Copilot

NodeZero is a zero-cost, serverless, real-time command engine designed to optimize stadium operations and crisis management during high-velocity mass events like the FIFA World Cup 2026. 

By eliminating the human cognitive bottleneck of parsing chaotic, multi-lingual, and unstructured real-world data (such as frantic security radio chatter or medical text alerts), NodeZero acts as an intelligent data synthesis pipeline. It instantly transforms raw operational chaos into structured, actionable JSON states that reflect directly on a live tactical dashboard with sub-second latency.

---

## 🚀 Core Features

*   **The Chaos Simulator:** An integrated testing matrix allowing operations staff or hackathon judges to inject raw, frantic textual anomalies into the pipeline.
*   **1-Click Emergency Macros:** Pre-configured event profiles (Crowd Crushes, Pyro Outbreaks, Multilingual Friction) designed for seamless product demonstration.
*   **Gemini 1.5 Flash Synthesis Engine:** Direct client-to-API integration leveraging a strict `responseSchema` to guarantee absolute data typing without markdown clutter or parsing exceptions.
*   **Real-Time State Synchronization:** Completely serverless data propagation using Firebase Firestore WebSockets, bypassing traditional API server overhead and latency.
*   **Encapsulated Tactical UI:** A clean, dark-mode dashboard built in React and Tailwind CSS v4 that maps events chronologically and color-codes live physical nodes based on parsed crisis severity.

---

## 🛠️ Tech Stack & Architecture

*   **Frontend Framework:** React (Vite)
*   **Styling Engine:** Tailwind CSS v4 (using `@tailwindcss/vite` native compilation)
*   **GenAI Framework:** Google Gemini 1.5 Flash API (via Google AI Studio)
*   **Database & Live Bus:** Firebase Firestore
*   **Linter:** ESLint (Pre-configured for React Hooks safety)

### Repository Directory Tree

```text
nodezero/
├── .gitignore
├── design.md              # Architectural Specifications
├── gemini.md              # AI Integration Contracts
└── frontend/              # Isolated Frontend Workspace
    ├── .env.local         # Local API Key Storage
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── firebaseConfig.js
        ├── utils/
        │   └── api.js      # Decoupled Gemini Execution Layer
        ├── hooks/
        │   └── useIncidents.js
        └── components/
            ├── ChaosGenerator.jsx
            └── IncidentFeed.jsx