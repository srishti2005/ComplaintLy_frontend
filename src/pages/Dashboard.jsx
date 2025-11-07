import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  Bell, 
  PieChart, 
  Search, 
  LogOut, 
  User,
  LayoutGrid,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const Dashboard = ({ user, onLogout, complaints, onUpdateComplaint }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const stats = React.useMemo(() => {
    if (!complaints || complaints.length === 0) {
      return { total: 0, pending: 0, resolved: 0, critical: 0, categories: {} };
    }
    
    const total = complaints.length;
    const resolved = complaints.filter(c => c && c.status === 'resolved').length;
    const pending = complaints.filter(c => c && c.status === 'pending').length;
    const critical = complaints.filter(c => c && (c.priority === 'high' || c.priority === 'critical')).length;
    
    const categories = {};
    complaints.forEach(c => {
      if (c && c.category) {
        categories[c.category] = (categories[c.category] || 0) + 1;
      }
    });

    return { total, pending, resolved, critical, categories };
  }, [complaints]);

  const filteredComplaints = React.useMemo(() => {
    if (!complaints || complaints.length === 0) return [];
    
    return complaints.filter(complaint => {
      if (!complaint) return false;
      
      const complaintText = complaint.complaint_text || '';
      const complaintId = complaint.complaint_id || '';
      const complaintStatus = complaint.status || 'pending';
      
      const matchesSearch = complaintText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           complaintId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || complaintStatus === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [complaints, searchQuery, selectedFilter]);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const handleComplaintClick = (complaint) => {
    if (complaint.status === 'pending') {
      onUpdateComplaint(complaint.complaint_id, 'resolved');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 purple-gradient text-white p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Complaint Analyzer</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            <LayoutGrid className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => navigate('/classify')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-xl transition"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Classify Complaint</span>
          </button>
        </nav>

        <div className="mt-auto">
          {user && (
            <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{user?.name}</p>
                  <p className="text-xs text-purple-100">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-xl transition font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
            <p className="text-gray-600">Overview of your complaint analytics</p>
          </div>

          {/* Search Bar and Filter */}
          <div className="mb-8 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Pending vs Resolved */}
            <div className="bg-white rounded-2xl shadow-lg p-6 card-hover cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">Pending v/s Resolved</h3>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-800">{stats.pending}</div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                  <div className="text-xs text-gray-500">Resolved</div>
                </div>
              </div>
            </div>

            {/* Total Complaints */}
            <div 
              className="bg-white rounded-2xl shadow-lg p-6 card-hover cursor-pointer"
              onClick={() => setSelectedFilter('all')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">Total complaints</h3>
              <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>All time</span>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-6 card-hover cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">Categories</h3>
              <div className="text-3xl font-bold text-gray-800">
                {Object.keys(stats.categories).length}
              </div>
              <div className="text-xs text-gray-500 mt-2">Different types</div>
            </div>

            {/* Critical Complaints */}
            <div 
              className="bg-white rounded-2xl shadow-lg p-6 card-hover cursor-pointer"
              onClick={() => setSelectedFilter('pending')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">Critical complaints</h3>
              <div className="text-3xl font-bold text-gray-800">{stats.critical}</div>
              <div className="text-xs text-red-600 mt-2">Needs attention</div>
            </div>
          </div>

          {/* Categories Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Complaint Categories</h3>
            {Object.keys(stats.categories).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stats.categories).map(([category, count]) => (
                  <div key={category} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700 capitalize">{category}</span>
                        <span className="text-sm text-gray-600">{count} {count === 1 ? 'complaint' : 'complaints'}</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ 
                            width: `${(count / stats.total) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No complaints classified yet</p>
                <button
                  onClick={() => navigate('/classify')}
                  className="btn-primary text-white font-semibold py-2 px-6 rounded-xl text-sm"
                >
                  Classify Your First Complaint
                </button>
              </div>
            )}
          </div>

          {/* Recent Complaints List */}
          {filteredComplaints && filteredComplaints.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Complaints</h3>
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => {
                  if (!complaint) return null;
                  
                  return (
                    <div 
                      key={complaint.complaint_id || Math.random()} 
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => handleComplaintClick(complaint)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-sm text-gray-500">{complaint.complaint_id || 'N/A'}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              complaint.status === 'resolved' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {complaint.status === 'resolved' ? (
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Resolved
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Pending
                                </span>
                              )}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2 line-clamp-2">{complaint.complaint_text || 'No text available'}</p>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium capitalize">
                              {complaint.category || 'Uncategorized'}
                            </span>
                            <span className="text-gray-500">{complaint.language || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;