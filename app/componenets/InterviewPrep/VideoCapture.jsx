/**
 * Video Capture Component - Production Level Implementation
 * Handles camera recording and video display
 */

'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff, Video, VideoOff, AlertCircle, Check } from 'lucide-react';

const VideoCapture = ({ 
  isRecording, 
  onRecordingStart, 
  onRecordingStop, 
  onVideoData,
  showControls = true,
  className = "" 
}) => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState('prompting');
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoBlob, setVideoBlob] = useState(null);
  const [error, setError] = useState(null);
  const recordingIntervalRef = useRef(null);

  // Check camera permissions
  useEffect(() => {
    checkPermissions();
  }, []);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const checkPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      stream.getTracks().forEach(track => track.stop());
      setPermissionStatus('granted');
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setPermissionStatus('denied');
        setError('Camera and microphone permissions are required for the interview');
      } else if (err.name === 'NotFoundError') {
        setPermissionStatus('not-found');
        setError('No camera or microphone found');
      } else {
        setPermissionStatus('error');
        setError('Failed to access camera and microphone');
      }
    }
  };

  const startRecording = useCallback(() => {
    if (!webcamRef.current) return;

    const stream = webcamRef.current.stream;
    if (!stream) {
      setError('Camera stream not available');
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
        if (onVideoData) {
          onVideoData(blob);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      
      if (onRecordingStart) {
        onRecordingStart();
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to start recording');
      console.error('Recording error:', err);
    }
  }, [onRecordingStart, onVideoData]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      if (onRecordingStop) {
        onRecordingStop();
      }
    }
  }, [onRecordingStop]);

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const toggleMicrophone = () => {
    setIsMicrophoneOn(!isMicrophoneOn);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const videoConstraints = {
    width: { ideal: 1280, max: 1920 },
    height: { ideal: 720, max: 1080 },
    facingMode: 'user',
    frameRate: { ideal: 30, max: 60 }
  };

  const audioConstraints = {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 44100
  };

  if (permissionStatus === 'denied' || permissionStatus === 'not-found' || permissionStatus === 'error') {
    return (
      <div className={`bg-gray-900 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">Camera Access Required</h3>
          <p className="text-gray-300 text-sm mb-4">{error}</p>
          <button
            onClick={checkPermissions}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (permissionStatus === 'prompting') {
    return (
      <div className={`bg-gray-900 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <Camera className="w-12 h-12 text-indigo-500 mx-auto mb-4 animate-pulse" />
          <h3 className="text-white font-semibold mb-2">Requesting Camera Access</h3>
          <p className="text-gray-300 text-sm">Please allow camera and microphone access</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {/* Video Feed */}
      <div className="relative aspect-video">
        {isCameraOn ? (
          <Webcam
            ref={webcamRef}
            audio={isMicrophoneOn}
            videoConstraints={videoConstraints}
            audioConstraints={audioConstraints}
            className="w-full h-full object-cover"
            mirrored={true}
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <CameraOff className="w-16 h-16 text-gray-600" />
          </div>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
          </div>
        )}

        {/* Camera Status */}
        {!isCameraOn && (
          <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full">
            <span className="text-sm font-medium">Camera Off</span>
          </div>
        )}

        {/* Microphone Status */}
        {!isMicrophoneOn && (
          <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full">
            <span className="text-sm font-medium">Mic Off</span>
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex justify-center items-center space-x-4">
            {/* Camera Toggle */}
            <button
              onClick={toggleCamera}
              className={`p-3 rounded-full transition-all ${
                isCameraOn 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
              title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isCameraOn ? <Camera size={20} /> : <CameraOff size={20} />}
            </button>

            {/* Recording Control */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!isCameraOn}
              className={`p-4 rounded-full transition-all ${
                isRecording 
                  ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
              title={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <VideoOff size={24} /> : <Video size={24} />}
            </button>

            {/* Microphone Toggle */}
            <button
              onClick={toggleMicrophone}
              className={`p-3 rounded-full transition-all ${
                isMicrophoneOn 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
              title={isMicrophoneOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {isMicrophoneOn ? <Check size={20} /> : <AlertCircle size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg max-w-xs">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default VideoCapture;
