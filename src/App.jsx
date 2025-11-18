import React, { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import RuralKiosk from './components/RuralKiosk';
import OfficerPortal from './components/OfficerPortal';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import CitizenPortal from './components/CitizenPortal';
import ChatBot from './components/ChatBot';
import { initialOfficers, departments } from './data/initialOfficers';
import { initialComplaints } from './data/initialComplaints';
import { assignToOfficer, updateOfficerCounts, getDepartmentLabel } from './utils/assignmentLogic';

function App() {
  const [currentRole, setCurrentRole] = useState(null);
  const [officers, setOfficers] = useState(initialOfficers);
  const [complaints, setComplaints] = useState(initialComplaints);

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
    setCurrentRole(role);
  };

  const handleBack = () => {
    setCurrentRole(null);
  };

  return (
    <div className="App">
      {!currentRole && (
        <RoleSelector onSelectRole={handleRoleSelection} />
      )}

      {currentRole === 'kiosk' && (
        <RuralKiosk
          onBack={handleBack}
          onSubmitComplaint={handleSubmitComplaint}
        />
      )}

      {currentRole === 'officer' && (
        <OfficerPortal
          officers={officers}
          complaints={complaints}
          onBack={handleBack}
          onUpdateComplaint={handleUpdateComplaint}
          onRequestCategoryChange={handleRequestCategoryChange}
        />
      )}

      {currentRole === 'admin' && (
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
      )}

      {currentRole === 'citizen' && (
        <CitizenPortal
          complaints={complaints}
          onBack={handleBack}
        />
      )}

      {/* ChatBot available in all portals */}
      {currentRole && <ChatBot />}
    </div>
  );
}

export default App;
