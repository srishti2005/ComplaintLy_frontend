import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  FileText, 
  LayoutGrid,
  User, 
  LogOut,
  AlertCircle,
  CheckCircle,
  Loader,
  X,
  Mail,
  Lock
} from 'lucide-react';
import { classifyComplaint, signup as signupApi } from '../utils/api';

const Classify = ({ user, onLogout, onLogin, onAddComplaint }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    complaint_text: '',
    language: 'English'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [classificationResult, setClassificationResult] = useState(null);
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleAuthChange = (e) => {
    setAuthData({
      ...authData,
      [e.target.name]: e.target.value
    });
    setAuthError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.complaint_text.trim()) {
      setError('Please enter a complaint text');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const complaintData = {
        complaint_id: `CMP-${Date.now()}`,
        complaint_text: formData.complaint_text,
        language: formData.language,
        status: 'pending',
        priority: Math.random() > 0.5 ? 'high' : 'normal',
        category: '' // Will be filled by API
      };
      
      const response = await classifyComplaint(complaintData);
      
      // Merge the complaint data with the API response
      const fullComplaint = {
        ...complaintData,
        ...response,
        category: response.category || 'general'
      };
      
      setClassificationResult(fullComplaint);
      setLoading(false);
      
      if (!user) {
        setShowAuthModal(true);
        setAuthMode('signup');
      } else {
        setResult(fullComplaint);
        onAddComplaint(fullComplaint);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Classification failed. Please try again.');
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'signup') {
      if (authData.password !== authData.confirmPassword) {
        setAuthError('Passwords do not match');
        return;
      }

      if (authData.password.length < 6) {
        setAuthError('Password must be at least 6 characters');
        return;
      }
    }

    setAuthLoading(true);

    try {
      let response;
      if (authMode === 'signup') {
        response = await signupApi(authData.name, authData.email, authData.password);
      } else {
        const { login } = await import('../utils/api');
        response = await login(authData.email, authData.password);
      }
      
      onLogin(response.user);
      setShowAuthModal(false);
      setResult(classificationResult);
      onAddComplaint(classificationResult);
      setAuthData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      setAuthError(err.response?.data?.error || `${authMode === 'signup' ? 'Signup' : 'Login'} failed. Please try again.`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSave = () => {
    navigate('/dashboard');
  };

  const handleNewClassification = () => {
    setFormData({
      complaint_text: '',
      language: 'English'
    });
    setResult(null);
    setError('');
    setShowAuthModal(false);
    setClassificationResult(null);
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'signup' ? 'login' : 'signup');
    setAuthError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Only show if user is logged in */}
      {user && (
        <div className="w-80 purple-gradient text-white p-6 flex flex-col">
          <div className="mb-8">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-white hover:text-purple-200 transition mb-4"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Complaint Analyzer</h1>
          </div>

          <nav className="flex-1 space-y-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-xl transition"
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
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
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-xl transition font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 p-8 overflow-auto ${!user ? 'max-w-7xl mx-auto w-full' : ''}`}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            {!user && (
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-800 transition mb-4 flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            )}
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Classify Complaint</h2>
            <p className="text-gray-600">Analyze and categorize your complaints</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Input Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complaint Text
                  </label>
                  <textarea
                    name="complaint_text"
                    value={formData.complaint_text}
                    onChange={handleChange}
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                    placeholder="Enter your complaint text here..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-white font-semibold py-4 px-8 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Classifying...
                    </>
                  ) : (
                    'CLASSIFY COMPLAINT'
                  )}
                </button>
              </form>
            </div>

            {/* Right Side - Results */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="purple-gradient rounded-t-2xl -m-8 mb-6 p-6 text-white">
                <h3 className="text-2xl font-bold">Results</h3>
              </div>

              {result && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-800 mb-1">Classification Successful!</p>
                      <p className="text-sm text-green-700">Your complaint has been analyzed and categorized.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Complaint ID
                    </label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="font-mono text-gray-700 font-semibold">
                        {result.complaint_id}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Category
                    </label>
                    <div className="px-4 py-4 bg-purple-50 border border-purple-200 rounded-xl">
                      <span className="text-xl font-bold text-primary capitalize">
                        {result.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-secondary hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition"
                    >
                      SAVE
                    </button>
                    <button
                      onClick={handleNewClassification}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition"
                    >
                      NEW
                    </button>
                  </div>
                </div>
              )}

              {!result && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No classification yet</p>
                  <p className="text-sm text-gray-400">
                    Fill in the form and click "Classify Complaint" to see results here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative fade-in">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Classification Complete!
              </h3>
              <p className="text-gray-600">
                {authMode === 'signup' 
                  ? 'Sign up to save your results'
                  : 'Log in to save your results'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{authError}</p>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={authData.name}
                      onChange={handleAuthChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={authData.email}
                    onChange={handleAuthChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={authData.password}
                    onChange={handleAuthChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={authData.confirmPassword}
                      onChange={handleAuthChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full btn-primary text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading 
                  ? (authMode === 'signup' ? 'Creating Account...' : 'Logging in...') 
                  : (authMode === 'signup' ? 'Sign Up & View Results' : 'Log In & View Results')}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {authMode === 'signup' 
                  ? 'Already have an account? ' 
                  : "Don't have an account? "}
                <button
                  onClick={switchAuthMode}
                  className="text-primary font-semibold hover:underline"
                >
                  {authMode === 'signup' ? 'Log In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classify;