import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Users, FileText, CheckCircle, XCircle, Shield, LogOut } from 'lucide-react';
import { getDepartmentIcon, getPriorityColor, getStatusColor } from '../utils/categoryDetection';
import { departments } from '../data/initialOfficers';

// Super Admin Credentials
const SUPER_ADMIN = {
  username: 'superadmin',
  password: 'admin@2025'
};

const SuperAdminDashboard = ({ officers, complaints, onBack, onCreateOfficer, onApproveCategoryChange }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, officers, categoryChanges
  const [showCreateOfficer, setShowCreateOfficer] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    name: '',
    department: '',
    username: '',
    password: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === SUPER_ADMIN.username && password === SUPER_ADMIN.password) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. Access denied!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setActiveTab('overview');
  };

  // Statistics
  const stats = {
    totalComplaints: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    totalOfficers: officers.length,
    categoryChangeRequests: complaints.filter(c => c.categoryChangeRequest).length
  };

  // Department distribution
  const deptDistribution = departments.map(dept => ({
    ...dept,
    count: complaints.filter(c => c.category === dept.value).length
  }));

  const handleCreateOfficer = (e) => {
    e.preventDefault();

    if (!newOfficer.name || !newOfficer.department || !newOfficer.username || !newOfficer.password) {
      alert('Please fill all fields!');
      return;
    }

    // Check if username already exists
    if (officers.find(o => o.username === newOfficer.username)) {
      alert('Username already exists!');
      return;
    }

    onCreateOfficer({
      id: `officer${officers.length + 1}`,
      name: newOfficer.name,
      department: newOfficer.department,
      username: newOfficer.username,
      password: newOfficer.password,
      activeComplaints: 0
    });

    setNewOfficer({ name: '', department: '', username: '', password: '' });
    setShowCreateOfficer(false);
    alert('✅ Officer created successfully!');
  };

  const handleApproveCategoryChange = (complaint, newCategory) => {
    onApproveCategoryChange(complaint.id, newCategory);
    alert('✅ Category changed and complaint reassigned!');
  };

  const handleRejectCategoryChange = (complaintId) => {
    onApproveCategoryChange(complaintId, null); // Pass null to reject
    alert('❌ Category change request rejected!');
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center p-4">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center space-x-2 text-gray-700 hover:bg-white/50 px-6 py-3 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-purple-200">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield size={48} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Super Admin Login</h1>
              <p className="text-xl text-gray-600 mb-1">सुपर एडमिन लॉगिन</p>
              <p className="text-sm text-red-600 font-semibold mt-2">🔒 Restricted Access</p>
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  placeholder="Enter admin username"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg font-semibold">
                  🚫 {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-lg text-xl font-bold hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🔓 Login • लॉगिन करें
              </button>
            </form>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs text-gray-600 text-center font-semibold">
                ⚠️ This area is for authorized administrators only
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Super Admin Dashboard</h1>
              <p className="text-xl opacity-90">सुपर एडमिन डैशबोर्ड - System Management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-purple-500">
            <div className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</div>
            <div className="text-sm text-gray-600">Total Complaints</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-gray-900">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-green-500">
            <div className="text-2xl font-bold text-gray-900">{stats.resolved}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-indigo-500">
            <div className="text-2xl font-bold text-gray-900">{stats.totalOfficers}</div>
            <div className="text-sm text-gray-600">Total Officers</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-red-500">
            <div className="text-2xl font-bold text-gray-900">{stats.categoryChangeRequests}</div>
            <div className="text-sm text-gray-600">Change Requests</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-purple-500 text-white rounded-tl-xl'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText size={20} className="inline mr-2" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('officers')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === 'officers'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users size={20} className="inline mr-2" />
              Officers ({officers.length})
            </button>

            <button
              onClick={() => setActiveTab('categoryChanges')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors relative ${
                activeTab === 'categoryChanges'
                  ? 'bg-purple-500 text-white rounded-tr-xl'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CheckCircle size={20} className="inline mr-2" />
              Category Changes
              {stats.categoryChangeRequests > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {stats.categoryChangeRequests}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Department Distribution */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Department Distribution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deptDistribution.map(dept => (
                      <div key={dept.value} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{dept.icon}</div>
                            <div>
                              <div className="font-semibold text-gray-900">{dept.label}</div>
                              <div className="text-sm text-gray-500">{dept.count} complaints</div>
                            </div>
                          </div>
                          <div className="text-3xl font-bold text-purple-600">{dept.count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Complaints */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Recent Complaints</h3>
                  <div className="space-y-3">
                    {complaints.slice(-5).reverse().map(complaint => (
                      <div key={complaint.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{getDepartmentIcon(complaint.category)}</div>
                          <div>
                            <div className="font-semibold text-gray-900">{complaint.title}</div>
                            <div className="text-sm text-gray-500">{complaint.user} • {complaint.location}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`${getStatusColor(complaint.status)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                            {complaint.status}
                          </span>
                          <span className="text-sm text-gray-500">#{complaint.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Officers Tab */}
            {activeTab === 'officers' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">Officer Management</h3>
                  <button
                    onClick={() => setShowCreateOfficer(!showCreateOfficer)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg flex items-center space-x-2"
                  >
                    <UserPlus size={20} />
                    <span>Create New Officer</span>
                  </button>
                </div>

                {/* Create Officer Form */}
                {showCreateOfficer && (
                  <form onSubmit={handleCreateOfficer} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Create New Officer</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Officer Name *
                        </label>
                        <input
                          type="text"
                          value={newOfficer.name}
                          onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Full name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Department *
                        </label>
                        <select
                          value={newOfficer.department}
                          onChange={(e) => setNewOfficer({ ...newOfficer, department: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        >
                          <option value="">Select department</option>
                          {departments.map(dept => (
                            <option key={dept.value} value={dept.value}>
                              {dept.icon} {dept.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Username *
                        </label>
                        <input
                          type="text"
                          value={newOfficer.username}
                          onChange={(e) => setNewOfficer({ ...newOfficer, username: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="username"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password *
                        </label>
                        <input
                          type="password"
                          value={newOfficer.password}
                          onChange={(e) => setNewOfficer({ ...newOfficer, password: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="password"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowCreateOfficer(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all"
                      >
                        Create Officer
                      </button>
                    </div>
                  </form>
                )}

                {/* Officers List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {officers.map(officer => {
                    const dept = departments.find(d => d.value === officer.department);
                    return (
                      <div key={officer.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                              {officer.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-lg">{officer.name}</div>
                              <div className="text-sm text-gray-600">@{officer.username}</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-3xl">{dept?.icon}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between py-2 border-t border-gray-200">
                            <span className="text-gray-600">Department:</span>
                            <span className="font-semibold text-gray-900">{dept?.label}</span>
                          </div>

                          <div className="flex items-center justify-between py-2 border-t border-gray-200">
                            <span className="text-gray-600">Active Complaints:</span>
                            <span className="font-bold text-purple-600 text-xl">{officer.activeComplaints}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category Changes Tab */}
            {activeTab === 'categoryChanges' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Category Change Requests</h3>

                {stats.categoryChangeRequests === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500 text-xl">No pending category change requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {complaints
                      .filter(c => c.categoryChangeRequest)
                      .map(complaint => (
                        <div key={complaint.id} className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-300">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-2">{complaint.title}</h4>
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm text-gray-600">Current Category:</span>
                                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                  {getDepartmentIcon(complaint.category)} {departments.find(d => d.value === complaint.category)?.label}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">#{complaint.id}</div>
                          </div>

                          <div className="bg-orange-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-700">Requested by:</span>
                              <span className="text-sm text-gray-600">{complaint.categoryChangeRequest.officerName}</span>
                            </div>
                            <div className="text-sm text-gray-700 mb-2">
                              <span className="font-semibold">Reason:</span> {complaint.categoryChangeRequest.reason}
                            </div>
                            <div className="text-xs text-gray-500">{complaint.categoryChangeRequest.timestamp}</div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <label className="text-sm font-semibold text-gray-700">
                              Change to:
                            </label>
                            <select
                              id={`category-${complaint.id}`}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              {departments.filter(d => d.value !== complaint.category).map(dept => (
                                <option key={dept.value} value={dept.value}>
                                  {dept.icon} {dept.label}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => {
                                const select = document.getElementById(`category-${complaint.id}`);
                                handleApproveCategoryChange(complaint, select.value);
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                            >
                              <CheckCircle size={20} />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={() => handleRejectCategoryChange(complaint.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                            >
                              <XCircle size={20} />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
