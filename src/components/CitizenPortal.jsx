import React, { useState } from 'react';
import { ArrowLeft, Search, MapPin, Clock, User } from 'lucide-react';
import { getDepartmentIcon, getPriorityColor, getStatusColor } from '../utils/categoryDetection';

const CitizenPortal = ({ complaints, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.user.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 mb-4 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Citizen Portal</h1>
              <p className="text-xl opacity-90">नागरिक पोर्टल - Track All Complaints</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-gray-600 font-medium">Total Complaints</div>
            <div className="text-sm text-gray-500">कुल शिकायतें</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
            <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
            <div className="text-gray-600 font-medium">Pending</div>
            <div className="text-sm text-gray-500">लंबित</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-gray-900">{stats.inProgress}</div>
            <div className="text-gray-600 font-medium">In Progress</div>
            <div className="text-sm text-gray-500">प्रगति में</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="text-3xl font-bold text-gray-900">{stats.resolved}</div>
            <div className="text-gray-600 font-medium">Resolved</div>
            <div className="text-sm text-gray-500">हल हो गया</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by title, location, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-6">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-lg">
              <p className="text-gray-500 text-xl">No complaints found</p>
              <p className="text-gray-400">कोई शिकायत नहीं मिली</p>
            </div>
          ) : (
            filteredComplaints.map(complaint => (
              <div key={complaint.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{getDepartmentIcon(complaint.category)}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{complaint.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`${getStatusColor(complaint.status)} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                          {complaint.status.toUpperCase()}
                        </span>
                        <span className={`${getPriorityColor(complaint.priority)} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                          {complaint.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">ID: #{complaint.id}</div>
                    <div className="text-xs text-gray-400">{complaint.timestamp}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User size={18} className="text-gray-400" />
                    <span>{complaint.user}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin size={18} className="text-gray-400" />
                    <span>{complaint.location}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-700">
                    <Clock size={18} className="text-gray-400" />
                    <span>{complaint.assignedTo}</span>
                  </div>
                </div>

                {/* Remarks History */}
                {complaint.remarks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Progress Updates:</h4>
                    <div className="space-y-2">
                      {complaint.remarks.map((remark, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-3">
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenPortal;
