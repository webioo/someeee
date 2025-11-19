import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import RoleSelector from './components/RoleSelector';
import RuralKiosk from './components/RuralKiosk';
import OfficerPortal from './components/OfficerPortal';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import CitizenPortal from './components/CitizenPortal';
import ChatBot from './components/ChatBot';
import { initialOfficers, departments } from './data/initialOfficers';
import { initialComplaints } from './data/initialComplaints';
import { assignToOfficer, updateOfficerCounts, getDepartmentLabel } from './utils/assignmentLogic';
import {
  subscribeToComplaints,
  subscribeToOfficers,
  addComplaint as firebaseAddComplaint,
  updateComplaint as firebaseUpdateComplaint,
  addOfficer as firebaseAddOfficer,
  updateOfficer as firebaseUpdateOfficer,
  deleteOfficer as firebaseDeleteOfficer,
  isFirebaseAvailable,
  initializeData
} from './services/firebaseService';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize from localStorage or use initial data
  const [officers, setOfficers] = useState(() => {
    const saved = localStorage.getItem('civic_officers');
    return saved ? JSON.parse(saved) : initialOfficers;
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('civic_complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  // Initialize Firebase data on first load
  useEffect(() => {
    if (isFirebaseAvailable() && !firebaseInitialized) {
      console.log('🔄 Initializing Firebase data...');
      initializeData(initialComplaints, initialOfficers);
      setFirebaseInitialized(true);
    }
  }, [firebaseInitialized]);

  // Subscribe to Firebase real-time updates
  useEffect(() => {
    if (!isFirebaseAvailable()) {
      console.log('📦 Firebase not available, using localStorage only');
      return;
    }

    console.log('🔥 Setting up Firebase listeners...');

    // Subscribe to complaints
    const unsubscribeComplaints = subscribeToComplaints((firebaseComplaints) => {
      console.log(`✅ Synced ${firebaseComplaints.length} complaints from Firebase`);
      setComplaints(firebaseComplaints);
    });

    // Subscribe to officers
    const unsubscribeOfficers = subscribeToOfficers((firebaseOfficers) => {
      console.log(`✅ Synced ${firebaseOfficers.length} officers from Firebase`);
      // If Firebase has officers, use them. Otherwise, keep using initial officers from localStorage
      if (firebaseOfficers.length > 0) {
        setOfficers(firebaseOfficers);
      } else {
        // Firebase is empty, push initial officers to Firebase
        console.log('📤 Pushing initial officers to Firebase...');
        initialOfficers.forEach(async (officer) => {
          try {
            await firebaseAddOfficer(officer);
          } catch (error) {
            console.error('Error adding officer to Firebase:', error);
          }
        });
      }
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeComplaints();
      unsubscribeOfficers();
    };
  }, []);

  // Save to localStorage as backup (even when using Firebase)
  useEffect(() => {
    localStorage.setItem('civic_officers', JSON.stringify(officers));
  }, [officers]);

  useEffect(() => {
    localStorage.setItem('civic_complaints', JSON.stringify(complaints));
  }, [complaints]);

  // Update officer counts whenever complaints change
  useEffect(() => {
    setOfficers(prevOfficers => updateOfficerCounts(prevOfficers, complaints));
  }, [complaints]);

  // Handle new complaint submission from Rural Kiosk
  const handleSubmitComplaint = async (newComplaintData) => {
    // Assign to officer
    const assignedOfficerId = assignToOfficer(
      newComplaintData.category,
      officers,
      complaints
    );

    const newComplaint = {
      ...newComplaintData,
      id: complaints.length + 1,
      assignedOfficer: assignedOfficerId
    };

    // Update local state immediately for responsiveness
    setComplaints([...complaints, newComplaint]);

    // Sync with Firebase
    if (isFirebaseAvailable()) {
      try {
        await firebaseAddComplaint(newComplaint);
        console.log('✅ Complaint synced to Firebase');
      } catch (error) {
        console.error('❌ Failed to sync complaint to Firebase:', error);
      }
    }
  };

  // Handle complaint status update from Officer Portal
  const handleUpdateComplaint = async (complaintId, updates) => {
    // Update local state immediately
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint =>
        complaint.id === complaintId
          ? { ...complaint, ...updates }
          : complaint
      )
    );

    // Sync with Firebase
    if (isFirebaseAvailable()) {
      try {
        await firebaseUpdateComplaint(complaintId, updates);
        console.log('✅ Complaint update synced to Firebase');
      } catch (error) {
        console.error('❌ Failed to sync complaint update to Firebase:', error);
      }
    }
  };

  // Handle category change request from Officer Portal
  const handleRequestCategoryChange = async (complaintId, request) => {
    // Update local state immediately
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint =>
        complaint.id === complaintId
          ? { ...complaint, categoryChangeRequest: request }
          : complaint
      )
    );

    // Sync with Firebase
    if (isFirebaseAvailable()) {
      try {
        await firebaseUpdateComplaint(complaintId, { categoryChangeRequest: request });
        console.log('✅ Category change request synced to Firebase');
      } catch (error) {
        console.error('❌ Failed to sync category change request to Firebase:', error);
      }
    }
  };

  // Handle officer creation from Super Admin
  const handleCreateOfficer = async (newOfficer) => {
    // Update local state immediately
    setOfficers([...officers, newOfficer]);

    // Sync with Firebase
    if (isFirebaseAvailable()) {
      try {
        await firebaseAddOfficer(newOfficer);
        console.log('✅ Officer synced to Firebase');
      } catch (error) {
        console.error('❌ Failed to sync officer to Firebase:', error);
      }
    }
  };

  // Handle category change approval from Super Admin
  const handleApproveCategoryChange = async (complaintId, newCategory) => {
    if (newCategory === null) {
      // Reject - just remove the request
      setComplaints(prevComplaints =>
        prevComplaints.map(complaint =>
          complaint.id === complaintId
            ? { ...complaint, categoryChangeRequest: null }
            : complaint
        )
      );

      // Sync with Firebase
      if (isFirebaseAvailable()) {
        try {
          await firebaseUpdateComplaint(complaintId, { categoryChangeRequest: null });
          console.log('✅ Category change rejection synced to Firebase');
        } catch (error) {
          console.error('❌ Failed to sync category change rejection to Firebase:', error);
        }
      }
      return;
    }

    // Approve - change category and reassign
    let updatedComplaint = null;
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint => {
        if (complaint.id === complaintId) {
          const newOfficerId = assignToOfficer(newCategory, officers, complaints);
          const deptLabel = getDepartmentLabel(newCategory, departments);

          updatedComplaint = {
            ...complaint,
            category: newCategory,
            assignedTo: deptLabel,
            assignedOfficer: newOfficerId,
            categoryChangeRequest: null,
            remarks: [
              ...complaint.remarks,
              {
                by: 'admin',
                byName: 'Super Admin',
                text: `Category changed from ${complaint.category} to ${newCategory}. Reassigned to ${deptLabel}.`,
                timestamp: new Date().toLocaleString('en-IN'),
                statusChange: null
              }
            ]
          };
          return updatedComplaint;
        }
        return complaint;
      })
    );

    // Sync with Firebase
    if (isFirebaseAvailable() && updatedComplaint) {
      try {
        await firebaseUpdateComplaint(complaintId, {
          category: updatedComplaint.category,
          assignedTo: updatedComplaint.assignedTo,
          assignedOfficer: updatedComplaint.assignedOfficer,
          categoryChangeRequest: updatedComplaint.categoryChangeRequest,
          remarks: updatedComplaint.remarks
        });
        console.log('✅ Category change approval synced to Firebase');
      } catch (error) {
        console.error('❌ Failed to sync category change approval to Firebase:', error);
      }
    }
  };

  // Handle officer deletion from Super Admin
  const handleDeleteOfficer = async (officerId) => {
    // Update local state immediately
    setOfficers(prevOfficers => prevOfficers.filter(o => o.id !== officerId));

    // Sync with Firebase
    if (isFirebaseAvailable()) {
      try {
        await firebaseDeleteOfficer(officerId);
        console.log('✅ Officer deletion synced to Firebase');
      } catch (error) {
        console.error('❌ Failed to sync officer deletion to Firebase:', error);
      }
    }
  };

  // Handle password reset from Super Admin
  const handleResetPassword = async (officerId, newPassword) => {
    // Update local state immediately
    setOfficers(prevOfficers =>
      prevOfficers.map(officer =>
        officer.id === officerId
          ? { ...officer, password: newPassword }
          : officer
      )
    );

    // Sync with Firebase
    if (isFirebaseAvailable()) {
      try {
        await firebaseUpdateOfficer(officerId, { password: newPassword });
        console.log('✅ Password reset synced to Firebase');
      } catch (error) {
        console.error('❌ Failed to sync password reset to Firebase:', error);
      }
    }
  };

  // Handle complaint reassignment from Super Admin
  const handleReassignComplaint = async (complaintId, newOfficerId, newOfficerName) => {
    let updatedComplaint = null;

    // Update local state immediately
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint => {
        if (complaint.id === complaintId) {
          updatedComplaint = {
            ...complaint,
            assignedOfficer: newOfficerId,
            remarks: [
              ...complaint.remarks,
              {
                by: 'superadmin',
                byName: 'Super Admin',
                text: `Complaint reassigned to ${newOfficerName}`,
                timestamp: new Date().toLocaleString('en-IN'),
                statusChange: null
              }
            ]
          };
          return updatedComplaint;
        }
        return complaint;
      })
    );

    // Sync with Firebase
    if (isFirebaseAvailable() && updatedComplaint) {
      try {
        await firebaseUpdateComplaint(complaintId, {
          assignedOfficer: updatedComplaint.assignedOfficer,
          remarks: updatedComplaint.remarks
        });
        console.log('✅ Complaint reassignment synced to Firebase');
      } catch (error) {
        console.error('❌ Failed to sync complaint reassignment to Firebase:', error);
      }
    }
  };

  const handleRoleSelection = (role) => {
    navigate(`/${role}`);
  };

  const handleBack = () => {
    navigate(-1); // Go back in history
  };

  // Check if we're on a portal page (not home)
  const isOnPortal = location.pathname !== '/';

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<RoleSelector onSelectRole={handleRoleSelection} />} />

        <Route
          path="/kiosk"
          element={
            <RuralKiosk
              onBack={handleBack}
              onSubmitComplaint={handleSubmitComplaint}
            />
          }
        />

        <Route
          path="/officer"
          element={
            <OfficerPortal
              officers={officers}
              complaints={complaints}
              onBack={handleBack}
              onUpdateComplaint={handleUpdateComplaint}
              onRequestCategoryChange={handleRequestCategoryChange}
            />
          }
        />

        <Route
          path="/admin"
          element={
            <SuperAdminDashboard
              officers={officers}
              complaints={complaints}
              onBack={handleBack}
              onCreateOfficer={handleCreateOfficer}
              onApproveCategoryChange={handleApproveCategoryChange}
              onDeleteOfficer={handleDeleteOfficer}
              onResetPassword={handleResetPassword}
              onReassignComplaint={handleReassignComplaint}
              onUpdateComplaint={handleUpdateComplaint}
            />
          }
        />

        <Route
          path="/citizen"
          element={
            <CitizenPortal
              complaints={complaints}
              onBack={handleBack}
            />
          }
        />
      </Routes>

      {/* ChatBot available in all portals except home */}
      {isOnPortal && <ChatBot />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
