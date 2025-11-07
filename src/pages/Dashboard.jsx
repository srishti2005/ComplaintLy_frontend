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
  X,
  AlertCircle
} from 'lucide-react';

const Dashboard = ({ user, onLogout, complaints, onUpdateComplaint }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalComplaints, setModalComplaints] = useState([]);

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

  const handleCardClick = (type) => {
    let filteredData = [];
    
    switch(type) {
      case 'pending-resolved':
        filteredData = complaints.filter(c => c);
        setModalType('pending-resolved');
        break;
      case 'total':
        filteredData = complaints.filter(c => c);
        setModalType('total');
        break;
      case 'categories':
        filteredData = complaints.filter(c => c && c.category);
        setModalType('categories');
        break;
      case 'critical':
        filteredData = complaints.filter(c => c && (c.priority === 'high' || c.priority === 'critical'));
        setModalType('critical');
        break;
      default:
        filteredData = [];
    }
    
    setModalComplaints(filteredData);
    setShowModal(true);
  };

  const handleToggleStatus = (complaintId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'resolved' : 'pending';
    onUpdateComplaint(complaintId, newStatus);
    
    // Update modal complaints
    setModalComplaints(prevComplaints => 
      prevComplaints.map(c => 
        c.complaint_id === complaintId ? { ...c, status: newStatus } : c
      )
    );
  };

  const renderModalContent = () => {
    if (modalComplaints.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No complaints found</p>
        </div>
      );
    }

    switch(modalType) {
      case 'pending-resolved':
        return (
          <div className="space-y-4">
            {modalComplaints.map(complaint => (
              <div key={complaint.complaint_id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-gray-500">{complaint.complaint_id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        complaint.status === 'resolved' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {complaint.status === 'resolved' ? 'Resolved' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{complaint.complaint_text}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium capitalize">
                        {complaint.category || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(complaint.complaint_id, complaint.status)}
                    className={`ml-4 px-4 py-2 rounded-lg font-medium transition ${
                      complaint.status === 'pending'
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {complaint.status === 'pending' ? 'Resolve' : 'Reopen'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'total':
        return (
          <div className="space-y-4">
            {modalComplaints.map(complaint => (
              <div key={complaint.complaint_id} className="border border-gray-200 rounded-xl p-4">
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold text-gray-700">{complaint.complaint_id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      complaint.status === 'resolved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {complaint.status === 'resolved' ? 'Resolved' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Complaint Text: </span>
                    <span className="text-gray-700">{complaint.complaint_text}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Category: </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium capitalize">
                      {complaint.category || 'Uncategorized'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Language: </span>
                    <span className="text-gray-700">{complaint.language || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Priority: </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      complaint.priority === 'high' || complaint.priority === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {complaint.priority || 'Normal'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-4">
            {modalComplaints.map(complaint => (
              <div key={complaint.complaint_id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-gray-700">
                        {complaint.complaint_id}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize">
                        {complaint.category || 'Uncategorized'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{complaint.complaint_text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'critical':
        return (
          <div className="space-y-4">
            {modalComplaints.map(complaint => (
              <div key={complaint.complaint_id} className="border border-red-200 rounded-xl p-4 bg-red-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm font-semibold text-gray-700">{complaint.complaint_id}</span>
                      <span className="px-2 py-1 bg-red-600 text-white rounded-full text-xs font-semibold">
                        {complaint.priority || 'High'} Priority
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{complaint.complaint_text}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium capitalize">
                        {complaint.category || 'Uncategorized'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        complaint.status === 'resolved' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {complaint.status === 'resolved' ? 'Resolved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch(modalType) {
      case 'pending-resolved':
        return 'Pending vs Resolved Complaints';
      case 'total':
        return 'All Complaints';
      case 'categories':
        return 'Complaints by Category';
      case 'critical':
        return 'Critical Complaints';
      default:
        return 'Complaints';
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
            <div 
              onClick={() => handleCardClick('pending-resolved')}
              className="bg-white rounded-2xl shadow-lg p-6 card-hover cursor-pointer"
            >
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
              onClick={() => handleCardClick('total')}
              className="bg-white rounded-2xl shadow-lg p-6 card-hover cursor-pointer"
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
            <div 
              onClick={() => handleCardClick('categories')}
              className="bg-white rounded-2xl shadow-lg p-6 card-hover cursor-pointer"
            >
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
              onClick={() => handleCardClick('critical')}
              className="bg-white rounded-2xl shadow-lg p-6 card-hover cursor-pointer"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden fade-in">
            <div className="purple-gradient p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">{getModalTitle()}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;