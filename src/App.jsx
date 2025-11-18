import React, { useState } from 'react';
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

  // Save to localStorage whenever data changes
  React.useEffect(() => {
    localStorage.setItem('civic_officers', JSON.stringify(officers));
  }, [officers]);

  React.useEffect(() => {
    localStorage.setItem('civic_complaints', JSON.stringify(complaints));
  }, [complaints]);

  // Update officer counts whenever complaints change
  React.useEffect(() => {
    setOfficers(prevOfficers => updateOfficerCounts(prevOfficers, complaints));
  }, [complaints]);

  // Handle new complaint submission from Rural Kiosk
  const handleSubmitComplaint = (newComplaintData) => {
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

    setComplaints([...complaints, newComplaint]);
  };

  // Handle complaint status update from Officer Portal
  const handleUpdateComplaint = (complaintId, updates) => {
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint =>
        complaint.id === complaintId
          ? { ...complaint, ...updates }
          : complaint
      )
    );
  };

  // Handle category change request from Officer Portal
  const handleRequestCategoryChange = (complaintId, request) => {
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint =>
        complaint.id === complaintId
          ? { ...complaint, categoryChangeRequest: request }
          : complaint
      )
    );
  };

  // Handle officer creation from Super Admin
  const handleCreateOfficer = (newOfficer) => {
    setOfficers([...officers, newOfficer]);
  };

  // Handle category change approval from Super Admin
  const handleApproveCategoryChange = (complaintId, newCategory) => {
    if (newCategory === null) {
      // Reject - just remove the request
      setComplaints(prevComplaints =>
        prevComplaints.map(complaint =>
          complaint.id === complaintId
            ? { ...complaint, categoryChangeRequest: null }
            : complaint
        )
      );
      return;
    }

    // Approve - change category and reassign
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint => {
        if (complaint.id === complaintId) {
          const newOfficerId = assignToOfficer(newCategory, officers, complaints);
          const deptLabel = getDepartmentLabel(newCategory, departments);

          return {
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
        }
        return complaint;
      })
    );
  };

  // Handle officer deletion from Super Admin
  const handleDeleteOfficer = (officerId) => {
    setOfficers(prevOfficers => prevOfficers.filter(o => o.id !== officerId));
  };

  // Handle password reset from Super Admin
  const handleResetPassword = (officerId, newPassword) => {
    setOfficers(prevOfficers =>
      prevOfficers.map(officer =>
        officer.id === officerId
          ? { ...officer, password: newPassword }
          : officer
      )
    );
  };

  // Handle complaint reassignment from Super Admin
  const handleReassignComplaint = (complaintId, newOfficerId, newOfficerName) => {
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint => {
        if (complaint.id === complaintId) {
          return {
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
        }
        return complaint;
      })
    );
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
