import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  Bell, 
  PieChart, 
  Search, 
  LogOut, 
  User,
  ChevronLeft,
  LayoutGrid,  // Changed from Grid3x3
  TrendingUp
} from 'lucide-react';
import { getDashboardStats } from '../utils/api';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_complaints: 0,
    pending: 0,
    resolved: 0,
    critical: 0,
    categories: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 purple-gradient text-white p-6 flex flex-col">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="text-white hover:text-purple-200 transition mb-4"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
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
          <button
            onClick={handleLogout}
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

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Pending vs Resolved */}
            <div className="bg-white rounded-2xl shadow-lg p-6 card-hover">
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
            <div className="bg-white rounded-2xl shadow-lg p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">Total complaints</h3>
              <div className="text-3xl font-bold text-gray-800">{stats.total_complaints}</div>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>All time</span>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-6 card-hover">
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
            <div className="bg-white rounded-2xl shadow-lg p-6 card-hover">
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
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Complaint Categories</h3>
            {Object.keys(stats.categories).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stats.categories).map(([category, count]) => (
                  <div key={category} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">{category}</span>
                        <span className="text-sm text-gray-600">{count} complaints</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ 
                            width: `${(count / stats.total_complaints) * 100}%` 
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
                <p className="text-gray-500">No complaints classified yet</p>
                <button
                  onClick={() => navigate('/classify')}
                  className="mt-4 btn-primary text-white font-semibold py-2 px-6 rounded-xl text-sm"
                >
                  Classify Your First Complaint
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;