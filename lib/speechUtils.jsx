/**
 * Speech Utilities - Universal Browser Support Implementation
 * Handles voice recording, transcription, and text-to-speech functionality
 */

export class SpeechUtils {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.onTranscriptCallback = null;
    this.onErrorCallback = null;
    this.onStartCallback = null;
    this.onEndCallback = null;
    this.fallbackRecognition = null;
  }

  /**
   * Check browser compatibility for speech features
   */
  static checkBrowserCompatibility() {
    const hasWebkitSpeechRecognition = 'webkitSpeechRecognition' in window;
    const hasSpeechRecognition = 'SpeechRecognition' in window;
    const hasSpeechSynthesis = 'speechSynthesis' in window;
    const hasMediaRecorder = 'MediaRecorder' in window;
    const hasGetUserMedia = 'getUserMedia' in navigator.mediaDevices || 'getUserMedia' in navigator;

    return {
      isSupported: (hasWebkitSpeechRecognition || hasSpeechRecognition) && hasGetUserMedia,
      speechRecognition: hasWebkitSpeechRecognition || hasSpeechRecognition,
      speechSynthesis: hasSpeechSynthesis,
      mediaRecorder: hasMediaRecorder,
      getUserMedia: hasGetUserMedia,
      browser: this.getBrowserInfo()
    };
  }

  /**
   * Get browser information
   */
  static getBrowserInfo() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
    if (userAgent.indexOf('Safari') > -1) return 'Safari';
    if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
    if (userAgent.indexOf('Edge') > -1) return 'Edge';
    return 'Unknown';
  }

  /**
   * Initialize speech recognition with fallback support
   */
  async initializeSpeechRecognition() {
    try {
      // Check browser compatibility
      const hasWebkitSpeechRecognition = 'webkitSpeechRecognition' in window;
      const hasSpeechRecognition = 'SpeechRecognition' in window;
      
      if (!hasWebkitSpeechRecognition && !hasSpeechRecognition) {
        console.log('Speech recognition not supported, using fallback');
        await this.initializeFallbackRecognition();
        return;
      }

      // Try to initialize primary speech recognition
      await this.initializePrimaryRecognition();
    } catch (error) {
      console.warn('Primary speech recognition failed, trying fallback:', error);
      // Fallback to alternative method
      await this.initializeFallbackRecognition();
    }
  }

  /**
   * Initialize primary speech recognition
   */
  async initializePrimaryRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition for better accuracy
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;
    
    // Try to enhance with additional settings
    try {
      this.recognition.serviceURI = 'wss://www.google.com/speech-api/full-duplex/v1/recognize';
    } catch (e) {
      // Not all browsers support this
    }

    // Set up event handlers
    this.recognition.onstart = () => {
      this.isRecording = true;
      if (this.onStartCallback) this.onStartCallback();
    };

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (this.onTranscriptCallback) {
        this.onTranscriptCallback({
          final: finalTranscript.trim(),
          interim: interimTranscript.trim(),
          isFinal: event.results[event.results.length - 1].isFinal
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (this.onErrorCallback) {
        this.onErrorCallback(this.getErrorMessage(event.error));
      }
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      if (this.onEndCallback) this.onEndCallback();
    };
  }

  /**
   * Initialize fallback speech recognition
   */
  async initializeFallbackRecognition() {
    console.log('Using fallback speech recognition');
    
    // Create a mock recognition object that shows the limitation
    this.fallbackRecognition = {
      start: () => {
        if (this.onStartCallback) this.onStartCallback();
        // Show message about browser limitation
        setTimeout(() => {
          if (this.onTranscriptCallback) {
            this.onTranscriptCallback({
              final: '',
              interim: 'Voice recording not supported in this browser. Please type your answer.',
              isFinal: true
            });
          }
        }, 1000);
      },
      stop: () => {
        if (this.onEndCallback) this.onEndCallback();
      }
    };
  }

  /**
   * Start recording with fallback support
   */
  async startRecording() {
    try {
      if (this.fallbackRecognition) {
        this.fallbackRecognition.start();
        return;
      }

      if (!this.recognition) {
        throw new Error('Speech recognition not initialized');
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Start speech recognition
      this.recognition.start();
      
      // Optional: Set up media recorder for audio capture
      this.setupMediaRecorder(stream);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw new Error('Failed to start recording: ' + error.message);
    }
  }

  /**
   * Stop recording
   */
  stopRecording() {
    try {
      if (this.fallbackRecognition) {
        this.fallbackRecognition.stop();
        return;
      }

      if (this.recognition) {
        this.recognition.stop();
      }

      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  }

  /**
   * Set up media recorder for audio capture
   */
  setupMediaRecorder(stream) {
    try {
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioChunks = [];
        // Audio blob can be used for later processing if needed
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.warn('Media recorder setup failed:', error);
    }
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(error) {
    const errorMessages = {
      'no-speech': 'No speech detected. Please try speaking clearly.',
      'audio-capture': 'Microphone access denied. Please allow microphone access.',
      'not-allowed': 'Microphone access denied. Please allow microphone access.',
      'network': 'Network error. Please check your internet connection.',
      'service-not-allowed': 'Speech recognition service not available.',
      'bad-grammar': 'Could not understand. Please try again.',
      'language-not-supported': 'Language not supported. Using English.'
    };

    return errorMessages[error] || `Speech recognition error: ${error}`;
  }

  /**
   * Speak text using text-to-speech
   */
  async speakText(text, options = {}) {
    if (!this.synthesis) {
      throw new Error('Text-to-speech not supported in this browser');
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure utterance
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    utterance.lang = options.lang || 'en-US';

    // Wait for voices to be loaded
    if (this.synthesis.getVoices().length === 0) {
      await new Promise(resolve => {
        this.synthesis.onvoiceschanged = resolve;
      });
    }

    // Select a good voice
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Google')
    ) || voices.find(voice => 
      voice.lang.startsWith('en')
    ) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    return new Promise((resolve, reject) => {
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event.error);
      this.synthesis.speak(utterance);
    });
  }

  /**
   * Stop speaking
   */
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  /**
   * Set callbacks
   */
  setCallbacks(callbacks) {
    this.onTranscriptCallback = callbacks.onTranscript;
    this.onErrorCallback = callbacks.onError;
    this.onStartCallback = callbacks.onStart;
    this.onEndCallback = callbacks.onEnd;
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.stopRecording();
    this.stopSpeaking();
    this.recognition = null;
    this.mediaRecorder = null;
    this.fallbackRecognition = null;
    this.onStartCallback = null;
    this.onEndCallback = null;
  }

  /**
   * Get recording status
   */
  getRecordingStatus() {
    return {
      isRecording: this.isRecording,
      isSupported: this.recognition !== null,
      isSpeaking: this.synthesis && this.synthesis.speaking
    };
  }
}

/**
 * Voice Activity Detection - Detects when user starts/stops speaking
 */
export class VoiceActivityDetector {
  constructor(threshold = 0.02) {
    this.threshold = threshold;
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.isDetecting = false;
    this.onSpeechStart = null;
    this.onSpeechEnd = null;
  }

  /**
   * Initialize VAD
   */
  async initialize() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      
      this.analyser.fftSize = 256;
      this.microphone.connect(this.analyser);
      
      return true;
    } catch (error) {
      console.error('VAD initialization error:', error);
      throw error;
    }
  }

  /**
   * Start voice activity detection
   */
  startDetection() {
    if (!this.analyser) {
      throw new Error('VAD not initialized');
    }

    this.isDetecting = true;
    this.detect();
  }

  /**
   * Detect voice activity
   */
  detect() {
    if (!this.isDetecting) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const checkVolume = () => {
      if (!this.isDetecting) return;
      
      this.analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const normalizedVolume = average / 255;

      if (normalizedVolume > this.threshold) {
        if (this.onSpeechStart) this.onSpeechStart(normalizedVolume);
      } else {
        if (this.onSpeechEnd) this.onSpeechEnd(normalizedVolume);
      }

      requestAnimationFrame(checkVolume);
    };

    checkVolume();
  }

  /**
   * Stop detection
   */
  stopDetection() {
    this.isDetecting = false;
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.stopDetection();
    
    if (this.microphone) {
      this.microphone.disconnect();
    }
    
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export default SpeechUtils;
