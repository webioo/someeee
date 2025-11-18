import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { firebaseConfig, COLLECTIONS, USE_FIREBASE } from '../config/firebase';

// Initialize Firebase
let app = null;
let db = null;

try {
  if (USE_FIREBASE) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('🔥 Firebase initialized successfully');
  } else {
    console.log('📦 Using localStorage only (Firebase disabled)');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  console.log('📦 Falling back to localStorage');
}

// Check if Firebase is available
export const isFirebaseAvailable = () => {
  return db !== null;
};

// ========== COMPLAINTS ==========

// Get all complaints (real-time listener)
export const subscribeToComplaints = (callback) => {
  if (!db) {
    console.log('Using localStorage for complaints');
    return () => {}; // Return empty unsubscribe function
  }

  try {
    const complaintsRef = collection(db, COLLECTIONS.COMPLAINTS);
    const q = query(complaintsRef, orderBy('timestamp', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const complaints = [];
      snapshot.forEach((doc) => {
        complaints.push({ id: doc.id, ...doc.data() });
      });
      console.log(`📩 Received ${complaints.length} complaints from Firebase`);
      callback(complaints);
    }, (error) => {
      console.error('Error fetching complaints:', error);
    });
  } catch (error) {
    console.error('Error setting up complaints subscription:', error);
    return () => {};
  }
};

// Add new complaint
export const addComplaint = async (complaint) => {
  if (!db) {
    console.log('Firebase not available, skipping cloud save');
    return complaint;
  }

  try {
    const complaintRef = doc(collection(db, COLLECTIONS.COMPLAINTS));
    const complaintData = {
      ...complaint,
      id: complaintRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(complaintRef, complaintData);
    console.log('✅ Complaint added to Firebase:', complaintRef.id);
    return { ...complaintData, id: complaintRef.id };
  } catch (error) {
    console.error('Error adding complaint:', error);
    throw error;
  }
};

// Update complaint
export const updateComplaint = async (complaintId, updates) => {
  if (!db) {
    console.log('Firebase not available, skipping cloud update');
    return;
  }

  try {
    const complaintRef = doc(db, COLLECTIONS.COMPLAINTS, complaintId);
    await updateDoc(complaintRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Complaint updated in Firebase:', complaintId);
  } catch (error) {
    console.error('Error updating complaint:', error);
    throw error;
  }
};

// ========== OFFICERS ==========

// Get all officers (real-time listener)
export const subscribeToOfficers = (callback) => {
  if (!db) {
    console.log('Using localStorage for officers');
    return () => {};
  }

  try {
    const officersRef = collection(db, COLLECTIONS.OFFICERS);

    return onSnapshot(officersRef, (snapshot) => {
      const officers = [];
      snapshot.forEach((doc) => {
        officers.push({ id: doc.id, ...doc.data() });
      });
      console.log(`👮 Received ${officers.length} officers from Firebase`);
      callback(officers);
    }, (error) => {
      console.error('Error fetching officers:', error);
    });
  } catch (error) {
    console.error('Error setting up officers subscription:', error);
    return () => {};
  }
};

// Add new officer
export const addOfficer = async (officer) => {
  if (!db) {
    console.log('Firebase not available, skipping cloud save');
    return officer;
  }

  try {
    const officerRef = doc(db, COLLECTIONS.OFFICERS, officer.id);
    await setDoc(officerRef, {
      ...officer,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ Officer added to Firebase:', officer.id);
    return officer;
  } catch (error) {
    console.error('Error adding officer:', error);
    throw error;
  }
};

// Update officer
export const updateOfficer = async (officerId, updates) => {
  if (!db) {
    console.log('Firebase not available, skipping cloud update');
    return;
  }

  try {
    const officerRef = doc(db, COLLECTIONS.OFFICERS, officerId);
    await updateDoc(officerRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Officer updated in Firebase:', officerId);
  } catch (error) {
    console.error('Error updating officer:', error);
    throw error;
  }
};

// Delete officer
export const deleteOfficer = async (officerId) => {
  if (!db) {
    console.log('Firebase not available, skipping cloud delete');
    return;
  }

  try {
    const officerRef = doc(db, COLLECTIONS.OFFICERS, officerId);
    await deleteDoc(officerRef);
    console.log('✅ Officer deleted from Firebase:', officerId);
  } catch (error) {
    console.error('Error deleting officer:', error);
    throw error;
  }
};

// ========== INITIALIZATION ==========

// Initialize data (first time setup)
export const initializeData = async (initialComplaints, initialOfficers) => {
  if (!db) {
    console.log('Firebase not available, using localStorage');
    return;
  }

  try {
    // Check if data already exists
    const complaintsSnapshot = await getDocs(collection(db, COLLECTIONS.COMPLAINTS));
    const officersSnapshot = await getDocs(collection(db, COLLECTIONS.OFFICERS));

    // If no data exists, initialize with default data
    if (complaintsSnapshot.empty) {
      console.log('Initializing complaints in Firebase...');
      for (const complaint of initialComplaints) {
        await addComplaint(complaint);
      }
    }

    if (officersSnapshot.empty) {
      console.log('Initializing officers in Firebase...');
      for (const officer of initialOfficers) {
        await addOfficer(officer);
      }
    }

    console.log('✅ Firebase data initialized');
  } catch (error) {
    console.error('Error initializing Firebase data:', error);
  }
};

export default {
  isFirebaseAvailable,
  subscribeToComplaints,
  addComplaint,
  updateComplaint,
  subscribeToOfficers,
  addOfficer,
  updateOfficer,
  deleteOfficer,
  initializeData
};
