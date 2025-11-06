import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Left side - Dark Purple gradient */}
      <div className="w-1/2 purple-gradient wave-pattern flex items-center justify-center p-8">
        <div className="text-white text-center fade-in">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Package className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Analyze your<br />complaints
          </h1>
          <p className="text-lg text-purple-100 max-w-md mx-auto">
            "We are categorizing your complaints for you to best up your customer experience"
          </p>
        </div>
      </div>

      {/* Right side - Get Started */}
      <div className="w-1/2 bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Package className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome
              </h2>
              <p className="text-gray-600">
                Start analyzing and categorizing complaints efficiently
              </p>
            </div>

            <button
              onClick={() => navigate('/video-tutorial')}
              className="w-full btn-primary text-white font-semibold py-4 px-8 rounded-xl text-lg"
            >
              GET STARTED
            </button>

            <div className="mt-8">
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary font-semibold hover:underline"
                >
                  LOGIN
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;