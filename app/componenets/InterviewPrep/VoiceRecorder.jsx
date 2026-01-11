/**
 * Voice Recorder Component - Production Level Implementation
 * Handles voice recording, transcription, and text-to-speech
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, AlertCircle, Check } from 'lucide-react';
import SpeechUtils, { VoiceActivityDetector } from '../../../lib/speechUtils';

const VoiceRecorder = ({ 
  onTranscript, 
  onRecordingStart, 
  onRecordingStop,
  isAIResponding = false,
  className = "" 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(1);
  const [isVADActive, setIsVADActive] = useState(false);
  
  const speechUtilsRef = useRef(null);
  const vadRef = useRef(null);
  const timeoutRef = useRef(null);

  // Initialize speech utilities
  useEffect(() => {
    const initializeSpeech = async () => {
      try {
        // Check browser compatibility
        const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        const hasGetUserMedia = 'getUserMedia' in navigator.mediaDevices || 'getUserMedia' in navigator;
        
        if (!hasSpeechRecognition || !hasGetUserMedia) {
          setIsSupported(false);
          console.warn('Speech recognition not supported, falling back to manual input');
          setError('Speech recognition is not available in this browser. You can still type your answer below.');
          return;
        }

        speechUtilsRef.current = new SpeechUtils();
        
        // Set up callbacks
        speechUtilsRef.current.setCallbacks({
          onTranscript: handleTranscript,
          onError: handleError,
          onStart: handleRecordingStart,
          onEnd: handleRecordingEnd
        });

        await speechUtilsRef.current.initializeSpeechRecognition();
        console.log('Speech recognition initialized successfully');
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error);
        setIsSupported(false);
        setError('Speech recognition failed to initialize. You can still type your answer below.');
      }
    };

    initializeSpeech();

    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (speechUtilsRef.current) {
      speechUtilsRef.current.cleanup();
    }
    if (vadRef.current) {
      vadRef.current.cleanup();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleTranscript = useCallback((data) => {
    console.log('VoiceRecorder transcript data:', data);
    setInterimTranscript(data.interim);
    
    if (data.isFinal) {
      const finalTranscript = transcript + ' ' + data.final;
      console.log('Final transcript:', finalTranscript);
      setTranscript(finalTranscript.trim());
      setInterimTranscript('');
      
      // Only send transcript to parent, NO voice playback
      if (onTranscript) {
        console.log('Sending transcript to parent:', finalTranscript.trim());
        onTranscript(finalTranscript.trim());
      }
    }
  }, [transcript, onTranscript]);

  const handleError = useCallback((errorMessage) => {
    setError(errorMessage);
    setIsRecording(false);
  }, []);

  const handleRecordingStart = useCallback(() => {
    setIsRecording(true);
    setError(null);
    
    if (onRecordingStart) {
      onRecordingStart();
    }

    // Start VAD
    if (vadRef.current) {
      vadRef.current.startDetection();
    }
  }, [onRecordingStart]);

  const handleRecordingEnd = useCallback(() => {
    setIsRecording(false);
    
    if (onRecordingStop) {
      onRecordingStop(transcript.trim());
    }

    // Stop VAD
    if (vadRef.current) {
      vadRef.current.stopDetection();
    }
  }, [transcript, onRecordingStop]);

  const startRecording = async () => {
    if (!speechUtilsRef.current || isAIResponding) return;

    try {
      await speechUtilsRef.current.startRecording();
    } catch (err) {
      setError(err.message);
    }
  };

  const stopRecording = () => {
    if (!speechUtilsRef.current) return;
    
    speechUtilsRef.current.stopRecording();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const speakText = async (text, options = {}) => {
    // DISABLED: Prevent echo by not speaking user's answers
    console.log('speakText called but disabled to prevent echo');
    return;
    
    /* Original code - disabled to prevent echo
    if (!speechUtilsRef.current || isSpeaking) return;

    try {
      setIsSpeaking(true);
      await speechUtilsRef.current.speakText(text, {
        ...options,
        volume: volume
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSpeaking(false);
    }
    */
  };

  const stopSpeaking = () => {
    // DISABLED: Prevent echo by not speaking user's answers
    console.log('stopSpeaking called but disabled to prevent echo');
    setIsSpeaking(false);
    
    /* Original code - disabled to prevent echo
    if (speechUtilsRef.current) {
      speechUtilsRef.current.stopSpeaking();
      setIsSpeaking(false);
    }
    */
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  const adjustVolume = (newVolume) => {
    setVolume(newVolume);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSupported) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Voice Activity Indicator */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              isRecording ? 'bg-red-500 animate-pulse' : 
              isVADActive ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <span className="text-sm font-medium text-gray-700">
              {isRecording ? 'Recording...' : 
               isVADActive ? 'Voice detected' : 
               'Ready'}
            </span>
          </div>
          
          {isSpeaking && (
            <div className="flex items-center space-x-2 text-blue-600">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Speaking...</span>
            </div>
          )}
        </div>
      </div>

      {/* Transcript Display */}
      <div className="p-4 min-h-[120px] max-h-[200px] overflow-y-auto">
        <div className="space-y-2">
          {transcript && (
            <div className="text-gray-800">
              <span className="text-sm font-medium text-gray-500">You:</span>
              <p className="mt-1">{transcript}</p>
            </div>
          )}
          
          {interimTranscript && (
            <div className="text-gray-500 italic">
              <span className="text-sm font-medium text-gray-400">Interim:</span>
              <p className="mt-1">{interimTranscript}</p>
            </div>
          )}
          
          {!transcript && !interimTranscript && (
            <div className="text-gray-400 text-center py-8">
              <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Click the microphone to start speaking</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Record/Stop Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isAIResponding}
              className={`p-3 rounded-full transition-all ${
                isRecording 
                  ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
              title={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* Clear Button */}
            {transcript && (
              <button
                onClick={clearTranscript}
                className="p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                title="Clear transcript"
              >
                <span className="text-sm">Clear</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Volume Control - Disabled for echo prevention */}
            <div className="flex items-center space-x-2 opacity-50">
              <Volume2 className="w-4 h-4 text-gray-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled
                title="Volume control disabled to prevent echo"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border-t border-red-200">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-100 text-xs text-gray-500 flex justify-between">
        <span>
          {isRecording ? '🔴 Recording' : 
           isVADActive ? '🟢 Voice Active' : 
           '⚪ Ready'}
        </span>
        <span>
          🎤 Voice Input Only (No Playback)
        </span>
      </div>
    </div>
  );
};

export default VoiceRecorder;
