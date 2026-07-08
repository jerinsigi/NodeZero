import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure your Firebase initialization is exported here

export function useIncidents() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    // Enforce chronological ordering directly at the database query level
    const q = query(
      collection(db, 'incidents'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    // onSnapshot opens a WebSocket. Any write from the Gemini API triggers this instantly.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIncidents(liveData);
    });

    // Cleanup the listener when the component unmounts to prevent memory leaks
    return () => unsubscribe();
  }, []);

  return incidents;
}