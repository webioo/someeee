// Firebase configuration
// 🔥 SETUP REQUIRED: You need to create a Firebase project and add your config here

// To get your Firebase configuration:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Click "Add app" → Choose "Web" (</>) icon
// 4. Register your app with a nickname (e.g., "Civic Complaint Platform")
// 5. Copy the firebaseConfig object from the setup page
// 6. Paste it below, replacing the placeholder values

// For development/demo: You can use the default config below
// For production: MUST replace with your own Firebase project credentials

export const firebaseConfig = {
  // Replace these with your Firebase project credentials
  apiKey: process.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "civic-platform-demo.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "civic-platform-demo",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "civic-platform-demo.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Firestore collection names
export const COLLECTIONS = {
  COMPLAINTS: 'complaints',
  OFFICERS: 'officers'
};

// Enable/disable Firebase
// Set to false to use localStorage only (for offline development)
export const USE_FIREBASE = process.env.VITE_USE_FIREBASE !== 'false';
