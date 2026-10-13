const Storage = (() => {
  // ── Init Firebase ──────────────────────────────────────────────────────────
  const _app  = firebase.apps.length ? firebase.app() : firebase.initializeApp(CONFIG.FIREBASE);
  const _auth  = firebase.auth();
  const _db    = firebase.firestore();

  const COLLECTION = 'events';

  function isConfigured() { return true; }

  // ── Auth ───────────────────────────────────────────────────────────────────
  async function login(email, password) {
    const cred = await _auth.signInWithEmailAndPassword(email, password);
    return cred;
  }

  async function logout() {
    await _auth.signOut();
  }

  function onAuthChange(callback) {
    // Initial state
    _auth.onAuthStateChanged(user => callback(!!user));
  }

  // ── Schema helpers ─────────────────────────────────────────────────────────
  function _toApp(doc) {
    const d = doc.data ? doc.data() : doc;
    const id = doc.id || d.id;
    return {
      ...d,
      id,
      tags:      d.tags      || [],
      images:    d.images    || [],
      createdAt: d.createdAt || null,
      updatedAt: d.updatedAt || null,
    };
  }

  function _toDb(ev) {
    const db = { ...ev };
    // Firestore doesn't need a separate id field — it's the document id
    delete db.id;
    db.updatedAt = new Date().toISOString();
    if (!db.createdAt) db.createdAt = db.updatedAt;
    return db;
  }

  // ── Load ───────────────────────────────────────────────────────────────────
  async function load() {
    try {
      const snap = await _db.collection(COLLECTION).orderBy('date', 'asc').get();
      const data = snap.docs.map(doc => _toApp(doc));
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
      return data;
    } catch (e) {
      console.warn('Firestore load failed, falling back to local:', e);
    }

    // localStorage fallback
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (_) {}
    }

    // static JSON fallback
    try {
      const r = await fetch(CONFIG.DATA_PATH);
      const data = await r.json();
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
      return data;
    } catch (e) {
      console.error('Error loading events:', e);
      return [];
    }
  }

  // ── Add ────────────────────────────────────────────────────────────────────
  async function addEvent(ev) {
    const dbEv = _toDb(ev);
    const ref  = ev.id
      ? _db.collection(COLLECTION).doc(ev.id)
      : _db.collection(COLLECTION).doc();
    await ref.set(dbEv);
    // sync localStorage
    const raw    = localStorage.getItem(CONFIG.STORAGE_KEY);
    const events = raw ? JSON.parse(raw) : [];
    events.push({ ...dbEv, id: ref.id });
    events.sort((a, b) => a.date.localeCompare(b.date));
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(events));
  }

  // ── Update ─────────────────────────────────────────────────────────────────
  async function updateEvent(id, ev) {
    const dbEv = _toDb(ev);
    await _db.collection(COLLECTION).doc(id).set(dbEv, { merge: true });
    // sync localStorage
    const raw    = localStorage.getItem(CONFIG.STORAGE_KEY);
    const events = raw ? JSON.parse(raw) : [];
    const idx    = events.findIndex(e => e.id === id);
    if (idx >= 0) {
      events[idx] = { ...events[idx], ...dbEv, id };
      events.sort((a, b) => a.date.localeCompare(b.date));
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(events));
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function deleteEvent(id) {
    await _db.collection(COLLECTION).doc(id).delete();
    const raw    = localStorage.getItem(CONFIG.STORAGE_KEY);
    const events = raw ? JSON.parse(raw) : [];
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(events.filter(e => e.id !== id)));
  }

  // ── Bulk save (import) ─────────────────────────────────────────────────────
  async function save(events) {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(events));

    // Delete existing docs in batches of 500
    const snap = await _db.collection(COLLECTION).get();
    const DEL_BATCH_SIZE = 500;
    for (let i = 0; i < snap.docs.length; i += DEL_BATCH_SIZE) {
      const batch = _db.batch();
      snap.docs.slice(i, i + DEL_BATCH_SIZE).forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    }

    // Insert new docs in batches of 500
    for (let i = 0; i < events.length; i += 500) {
      const batch = _db.batch();
      events.slice(i, i + 500).forEach(ev => {
        const dbEv = _toDb(ev);
        const ref  = _db.collection(COLLECTION).doc(ev.id || undefined);
        batch.set(ref, dbEv);
      });
      await batch.commit();
    }
  }



  // ── Export / Import JSON ───────────────────────────────────────────────────
  function exportJSON(events) {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'events.json'; a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        try { resolve(JSON.parse(e.target.result)); }
        catch (err) { reject(err); }
      };
      reader.readAsText(file);
    });
  }

  function reset() {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
  }

  return {
    load,
    save,
    addEvent,
    updateEvent,
    deleteEvent,
    isConfigured,
    login,
    logout,
    onAuthChange,
    exportJSON,
    importJSON,
    reset
  };
})();
