import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';

const VideoTutorial = ({ onComplete }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setTimeout(() => {
      onComplete();
      navigate('/dashboard');
    }, 1000);
  };

  const handleSkip = () => {
    onComplete();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen purple-gradient flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            How to Use the App
          </h1>
          <p className="text-purple-100 text-lg">
            Watch this quick tutorial to get started with complaint classification
          </p>
        </div>

        <div className="video-container">
          <video
            ref={videoRef}
            className="w-full"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Crect fill='%238b5cf6' width='800' height='450'/%3E%3Ctext x='400' y='225' text-anchor='middle' fill='white' font-size='24' font-family='Arial'%3ETutorial Video%3C/text%3E%3C/svg%3E"
          >
            <source src="/demo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="video-controls">
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-primary" />
              ) : (
                <Play className="w-6 h-6 text-primary ml-1" />
              )}
            </button>

            <div className="flex-1">
              <div className="w-full bg-gray-600 h-1 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <Volume2 className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleSkip}
            className="inline-flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-3 px-6 rounded-xl transition backdrop-blur-sm"
          >
            <SkipForward className="w-5 h-5" />
            Skip Tutorial
          </button>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 text-white">
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Enter Complaint</h3>
            <p className="text-sm text-purple-100">Type or paste the complaint text</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Classify</h3>
            <p className="text-sm text-purple-100">AI analyzes and categorizes it</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">View Results</h3>
            <p className="text-sm text-purple-100">See category and save</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTutorial;