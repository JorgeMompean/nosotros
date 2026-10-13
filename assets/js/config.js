const CONFIG = {
  // Firebase config
  FIREBASE: {
    apiKey: "AIzaSyAOW37oxyXvdTRmZeZM1WHzdFmrWfDDy1g",
    authDomain: "nosotros-1e116.firebaseapp.com",
    projectId: "nosotros-1e116",
    storageBucket: "nosotros-1e116.firebasestorage.app",
    messagingSenderId: "545951789576",
    appId: "1:545951789576:web:0a76670ef26c947e3cd7bd",
    measurementId: "G-YDEFG5EKHM"
  },

  // Imágenes: ponle aquí tu API key de https://api.imgbb.com/ (gratis)
  // Sin key las imágenes se guardan en base64 en Firestore (no recomendado para fotos grandes)
  IMGBB_API_KEY: '8633dd571e13a073456e36ce7fdbb5c7',
  STORAGE_KEY: 'nosotros_events_v1',
  DATA_PATH: './data/events.json',
  VERSION: '1.0.0',
  PERSONS: {
    jorge: { label: 'Jorge', color: 'var(--color-jorge)', emoji: '👨' },
    gema: { label: 'Gema', color: 'var(--color-gema)', emoji: '👩' },
    juntos: { label: 'Juntos', color: 'var(--color-juntos)', emoji: '❤️' }
  },
  CATEGORIES: {
    hito: { label: 'Hito', emoji: '🌟' },
    viaje: { label: 'Viaje', emoji: '✈️' },
    estudios: { label: 'Estudios', emoji: '📚' },
    trabajo: { label: 'Trabajo', emoji: '💼' },
    vida: { label: 'Vida', emoji: '🌿' },
    familia: { label: 'Familia', emoji: '👨‍👩‍👧' }
  },
  MONTH_NAMES: ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
};
