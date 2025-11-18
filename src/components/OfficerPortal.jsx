import React, { useState } from 'react';
import { ArrowLeft, LogOut, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getDepartmentIcon, getPriorityColor, getStatusColor } from '../utils/categoryDetection';
import { departments } from '../data/initialOfficers';

const OfficerPortal = ({ officers, complaints, onBack, onUpdateComplaint, onRequestCategoryChange }) => {
  const [loggedInOfficer, setLoggedInOfficer] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [newRemark, setNewRemark] = useState('');
  const [categoryChangeReason, setCategoryChangeReason] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const officer = officers.find(
      o => o.username === username && o.password === password
    );

    if (officer) {
      setLoggedInOfficer(officer);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setLoggedInOfficer(null);
    setUsername('');
    setPassword('');
    setActiveComplaint(null);
  };

  const handleStatusUpdate = (complaint, newStatus) => {
    if (!newRemark.trim()) {
      alert('❌ Remark is mandatory when updating status! • स्टेटस अपडेट करते समय रिमार्क जरूरी है!');
      return;
    }

    const updatedRemarks = [
      ...complaint.remarks,
      {
        by: loggedInOfficer.id,
        byName: loggedInOfficer.name,
        text: newRemark,
        timestamp: new Date().toLocaleString('en-IN'),
        statusChange: `${complaint.status} → ${newStatus}`
      }
    ];

    onUpdateComplaint(complaint.id, {
      status: newStatus,
      remarks: updatedRemarks
    });

    setNewRemark('');
    setActiveComplaint(null);
    alert('✅ Status updated successfully! • स्टेटस सफलतापूर्वक अपडेट किया गया!');
  };

  const handleCategoryChangeRequest = (complaint) => {
    if (!categoryChangeReason.trim()) {
      alert('Please provide a reason for category change');
      return;
    }

    onRequestCategoryChange(complaint.id, {
      officerId: loggedInOfficer.id,
      officerName: loggedInOfficer.name,
      reason: categoryChangeReason,
      timestamp: new Date().toLocaleString('en-IN')
    });

    setCategoryChangeReason('');
    alert('✅ Category change request sent to admin!');
  };

  // Login Screen
  if (!loggedInOfficer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center space-x-2 text-gray-700 hover:bg-white/50 px-6 py-3 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Officer Login</h1>
              <p className="text-xl text-gray-600">अधिकारी लॉगिन</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Username • उपयोगकर्ता नाम
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Password • पासवर्ड
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter password"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-lg text-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
              >
                Login • लॉगिन करें
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 font-semibold mb-2">Demo Credentials:</p>
              <p className="text-xs text-gray-600">raj.patil / pass123 (Electricity)</p>
              <p className="text-xs text-gray-600">priya.sharma / pass123 (Water)</p>
              <p className="text-xs text-gray-600">amit.kumar / pass123 (Medical)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  const myComplaints = complaints.filter(c => c.assignedOfficer === loggedInOfficer.id);
  const stats = {
    total: myComplaints.length,
    pending: myComplaints.filter(c => c.status === 'pending').length,
    inProgress: myComplaints.filter(c => c.status === 'in-progress').length,
    resolved: myComplaints.filter(c => c.status === 'resolved').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Officer Dashboard</h1>
              <p className="text-xl opacity-90">
                {loggedInOfficer.name} • {departments.find(d => d.value === loggedInOfficer.department)?.label}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-gray-600 font-medium">Total Assigned</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
            <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
            <div className="text-gray-600 font-medium">Pending</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-gray-900">{stats.inProgress}</div>
            <div className="text-gray-600 font-medium">In Progress</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="text-3xl font-bold text-gray-900">{stats.resolved}</div>
            <div className="text-gray-600 font-medium">Resolved</div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-6">
          {myComplaints.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-lg">
              <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
              <p className="text-gray-500 text-xl">No complaints assigned</p>
            </div>
          ) : (
            myComplaints.map(complaint => (
              <div key={complaint.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{getDepartmentIcon(complaint.category)}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{complaint.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`${getStatusColor(complaint.status)} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                          {complaint.status.toUpperCase()}
                        </span>
                        <span className={`${getPriorityColor(complaint.priority)} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                          {complaint.priority.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-gray-700 text-sm">
                        <div>👤 {complaint.user}</div>
                        <div>📍 {complaint.location}</div>
                        <div>🕐 {complaint.timestamp}</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">ID: #{complaint.id}</div>
                  </div>
                </div>

                {/* Remarks History */}
                {complaint.remarks.length > 0 && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Clock size={16} className="mr-2" />
                      Remark History:
                    </h4>
                    <div className="space-y-2">
                      {complaint.remarks.map((remark, idx) => (
                        <div key={idx} className="bg-white rounded p-3 border border-gray-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-blue-600">{remark.byName}</span>
                            <span className="text-xs text-gray-500">{remark.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{remark.text}</p>
                          {remark.statusChange && (
                            <span className="text-xs text-green-600 font-medium">{remark.statusChange}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Section */}
                {complaint.status !== 'resolved' && (
                  <div className="border-t border-gray-200 pt-4 space-y-4">
                    {/* New Remark Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Add Remark (Mandatory) • रिमार्क जोड़ें (अनिवार्य) *
                      </label>
                      <textarea
                        value={activeComplaint === complaint.id ? newRemark : ''}
                        onChange={(e) => {
                          setNewRemark(e.target.value);
                          setActiveComplaint(complaint.id);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Enter your remark here..."
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {complaint.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(complaint, 'in-progress')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                        >
                          <AlertCircle size={20} />
                          <span>Start Work</span>
                        </button>
                      )}

                      {complaint.status === 'in-progress' && (
                        <button
                          onClick={() => handleStatusUpdate(complaint, 'resolved')}
                          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle size={20} />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                    </div>

                    {/* Category Change Request */}
                    {!complaint.categoryChangeRequest && (
                      <div className="border-t border-gray-200 pt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Request Category Change
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={activeComplaint === complaint.id ? categoryChangeReason : ''}
                            onChange={(e) => {
                              setCategoryChangeReason(e.target.value);
                              setActiveComplaint(complaint.id);
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Reason for category change..."
                          />
                          <button
                            onClick={() => handleCategoryChangeRequest(complaint)}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Request
                          </button>
                        </div>
                      </div>
                    )}

                    {complaint.categoryChangeRequest && (
                      <div className="bg-purple-100 border border-purple-400 rounded-lg p-4">
                        <p className="text-purple-800 font-semibold">
                          Category change requested - Waiting for admin approval
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {complaint.status === 'resolved' && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="bg-green-100 border border-green-400 rounded-lg p-4 flex items-center space-x-2">
                      <CheckCircle size={24} className="text-green-600" />
                      <span className="text-green-800 font-semibold">Complaint Resolved</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficerPortal;
