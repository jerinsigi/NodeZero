# NodeZero // Tactical Synthesis Copilot

NodeZero is a zero-cost, serverless, real-time command engine designed to optimize stadium operations and crisis management during high-velocity mass events like the FIFA World Cup 2026. 

By eliminating the human cognitive bottleneck of parsing chaotic, multi-lingual, and unstructured real-world data (such as frantic security radio chatter or medical text alerts), NodeZero acts as an intelligent data synthesis pipeline. It instantly transforms raw operational chaos into structured, actionable JSON states that reflect directly on a live tactical dashboard with sub-second latency.

---

## 🚀 Core Features

*   **The Chaos Simulator:** An integrated testing matrix allowing operations staff or hackathon judges to inject raw, frantic textual anomalies into the pipeline.
*   **1-Click Emergency Macros:** Pre-configured event profiles (Crowd Crushes, Pyro Outbreaks, Multilingual Friction) designed for seamless product demonstration.
*   **Gemini 2.5 Flash Lite Synthesis Engine:** Direct client-to-API integration leveraging a strict `responseSchema` to guarantee absolute data typing without markdown clutter or parsing exceptions.
*   **Real-Time State Synchronization:** Completely serverless data propagation using Firebase Firestore WebSockets, bypassing traditional API server overhead and latency.
*   **Encapsulated Tactical UI:** A clean, dark-mode dashboard built in React and Tailwind CSS v4 that maps events chronologically and color-codes live physical nodes based on parsed crisis severity.

---

## 🛠️ Tech Stack & Architecture

*   **Frontend Framework:** React (Vite)
*   **Styling Engine:** Tailwind CSS v4 (using `@tailwindcss/vite` native compilation)
*   **GenAI Framework:** Google Gemini 2.5 Flash Lite API (via Google AI Studio)
*   **Database & Live Bus:** Firebase Firestore
*   **Linter:** ESLint (Pre-configured for React Hooks safety)

### Repository Directory Tree

```text
nodezero/
├── .gitignore
├── README.md
├── documentation.pdf
└── frontend/              # Isolated Frontend Workspace
    ├── .env               # API Key Storage
    ├── eslint.config.js
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.css
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── firebaseConfig.js
        ├── assets/
        ├── hooks/
        │   └── useIncidents.js
        └── components/
            ├── ChaosGenerator.jsx
            ├── ChatBot.jsx
            ├── FanDashboard.jsx
            ├── IncidentFeed.jsx
            ├── Login.jsx
            ├── Maps.jsx
            ├── PublicAlertFeed.jsx
            ├── StadiumMatrix.jsx
            └── StaffDashboard.jsx
```

---

## 🎯 Chosen Vertical

**Sports, Entertainment & Live Events Management:** Specifically tailored for high-stakes, high-velocity stadium operations, crowd control, and crisis management during global events like the FIFA World Cup 2026.

## 🧠 Approach and Logic

Our core logic centers around eliminating the human cognitive bottleneck in crisis scenarios. In a stadium emergency, raw data (radio chatter, panicky texts) is chaotic and unstructured. 

Instead of relying on human operators to manually parse and enter this data into a system, NodeZero uses an LLM (Gemini 2.5 Flash Lite) as a real-time synthesis engine. We strictly enforce a JSON response schema from the LLM, effectively treating the AI not as a conversational agent, but as a robust, error-tolerant data parser. By combining this with a serverless architecture (direct client-to-API and client-to-database), we eliminate middle-tier server latency, ensuring tactical updates are reflected instantly on the dashboard.

## ⚙️ How the Solution Works

1. **Data Injection:** Staff members (or the built-in Chaos Simulator) input frantic, unstructured textual anomaly reports into the system.
2. **AI Synthesis:** The frontend directly queries the Gemini 2.5 Flash Lite API, instructing it to parse the unstructured text into a strict, predefined JSON schema.
3. **Structuring State:** Gemini extracts the core facts (incident type, location, severity, required response) and returns a clean JSON object.
4. **Real-Time Propagation:** The client pushes this structured state directly to a Firebase Firestore database.
5. **Tactical UI Update:** Using Firestore WebSockets, all connected dashboards instantly sync the new state, updating chronological feeds and color-coding live physical stadium nodes based on crisis severity.

## 💡 Assumptions Made

*   **Client Capabilities:** It is assumed that client devices (tablets/workstations used by stadium staff) have stable internet connections to interact directly with the Gemini API and Firebase WebSockets.
*   **Security & Auth Abstracted:** For the scope of this MVP, direct client-side API keys and database access are used to demonstrate raw speed and serverless capabilities. In a production environment, this would be wrapped in robust authentication (like Firebase App Check) and secure serverless edge functions.
*   **LLM Latency:** We assume the Gemini Flash Lite tier consistently provides sub-second inference times, which is critical for real-time tactical mapping.
*   **Schema Adherence:** We rely on the LLM's ability to strictly adhere to the provided JSON schema without hallucinating extra markdown or conversational text, which would otherwise break the frontend parser.