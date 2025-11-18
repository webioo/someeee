import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Check, Camera, RotateCcw } from 'lucide-react';
import { speakHindi, listenHindi, checkVoiceSupport, stopSpeaking } from '../utils/voiceUtils';
import { detectCategory } from '../utils/categoryDetection';

const RuralKiosk = ({ onBack, onSubmitComplaint }) => {
  const [step, setStep] = useState(0); // 0: welcome, 1-3: voice steps, 4: review
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [capturedData, setCapturedData] = useState({
    name: '',
    issue: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);

  const steps = [
    {
      question: 'Please tell your name',
      questionHindi: 'कृपया अपना नाम बताएं',
      field: 'name'
    },
    {
      question: 'Please describe your problem',
      questionHindi: 'कृपया अपनी समस्या बताएं',
      field: 'issue'
    },
    {
      question: 'Please tell your address',
      questionHindi: 'कृपया अपना पता बताएं',
      field: 'address'
    }
  ];

  useEffect(() => {
    const support = checkVoiceSupport();
    setVoiceSupported(support.supported);

    if (!support.supported) {
      setError('आपका ब्राउज़र वॉइस रिकग्निशन सपोर्ट नहीं करता। कृपया Chrome या Edge का उपयोग करें।');
    }

    return () => {
      stopSpeaking();
    };
  }, []);

  const startVoiceFlow = async () => {
    if (!voiceSupported) return;
    setStep(1);
    await askQuestion(0);
  };

  const askQuestion = async (stepIndex) => {
    try {
      setIsSpeaking(true);
      setError('');
      await speakHindi(
        steps[stepIndex].question,
        steps[stepIndex].questionHindi
      );
      setIsSpeaking(false);

      // Start listening after speaking
      setTimeout(() => {
        startListening(stepIndex);
      }, 500);
    } catch (err) {
      setIsSpeaking(false);
      setError('Voice error occurred. Please try again.');
      console.error('Speech error:', err);
    }
  };

  const startListening = async (stepIndex) => {
    try {
      setIsListening(true);
      setError('');

      const transcript = await listenHindi();
      setIsListening(false);

      if (transcript) {
        // Save captured data
        const field = steps[stepIndex].field;
        setCapturedData(prev => ({
          ...prev,
          [field]: transcript
        }));

        // Move to next step
        if (stepIndex < 2) {
          setStep(stepIndex + 2);
          await askQuestion(stepIndex + 1);
        } else {
          // All steps completed
          setStep(4);
        }
      }
    } catch (err) {
      setIsListening(false);
      setError('Could not capture voice. Click to retry.');
      console.error('Recognition error:', err);
    }
  };

  const retryCurrentStep = () => {
    const currentStepIndex = step - 1;
    if (currentStepIndex >= 0 && currentStepIndex < 3) {
      askQuestion(currentStepIndex);
    }
  };

  const handleSubmit = () => {
    // Detect category and create complaint
    const detection = detectCategory(capturedData.issue);

    const newComplaint = {
      title: capturedData.issue.substring(0, 50) + (capturedData.issue.length > 50 ? '...' : ''),
      category: detection.category,
      status: 'pending',
      user: capturedData.name,
      location: capturedData.address,
      timestamp: new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      priority: detection.priority,
      assignedTo: detection.dept,
      synced: true,
      remarks: [],
      categoryChangeRequest: null,
      photo: 'captured'
    };

    onSubmitComplaint(newComplaint);

    // Show success message
    speakHindi('Thank you! Your complaint has been registered', 'धन्यवाद! आपकी शिकायत दर्ज की गई है');

    // Reset after 2 seconds
    setTimeout(() => {
      setCapturedData({ name: '', issue: '', address: '' });
      setStep(0);
    }, 2000);
  };

  const restart = () => {
    stopSpeaking();
    setCapturedData({ name: '', issue: '', address: '' });
    setStep(0);
    setError('');
  };

  // Welcome Screen
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center space-x-2 text-white hover:bg-white/20 px-6 py-3 rounded-lg transition-colors text-xl"
        >
          <ArrowLeft size={24} />
          <span>Back</span>
        </button>

        <div className="max-w-4xl w-full text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            Rural Kiosk Voice System
          </h1>
          <h2 className="text-5xl font-semibold text-white/90 mb-12">
            ग्रामीण किओस्क आवाज प्रणाली
          </h2>

          {/* 3-Step Preview */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <div className="text-6xl mb-4">👤</div>
              <div className="text-2xl font-bold mb-2">Step 1</div>
              <div className="text-xl">Your Name</div>
              <div className="text-lg opacity-80">आपका नाम</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <div className="text-6xl mb-4">🗣️</div>
              <div className="text-2xl font-bold mb-2">Step 2</div>
              <div className="text-xl">Your Problem</div>
              <div className="text-lg opacity-80">आपकी समस्या</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <div className="text-6xl mb-4">📍</div>
              <div className="text-2xl font-bold mb-2">Step 3</div>
              <div className="text-xl">Your Address</div>
              <div className="text-lg opacity-80">आपका पता</div>
            </div>
          </div>

          {/* Start Button */}
          {voiceSupported ? (
            <button
              onClick={startVoiceFlow}
              className="bg-white text-green-600 px-16 py-8 rounded-full text-4xl font-bold shadow-2xl hover:scale-110 transform transition-all duration-300 hover:shadow-3xl"
            >
              <div className="flex items-center space-x-4">
                <Mic size={48} />
                <div>
                  <div>START</div>
                  <div className="text-2xl">शुरू करें</div>
                </div>
              </div>
            </button>
          ) : (
            <div className="bg-red-500 text-white px-12 py-6 rounded-2xl text-2xl">
              {error}
            </div>
          )}

          <p className="text-white text-2xl mt-8 opacity-90">
            Press START and speak when you see the microphone
          </p>
          <p className="text-white text-xl mt-2 opacity-80">
            स्टार्ट दबाएं और माइक्रोफोन दिखने पर बोलें
          </p>
        </div>
      </div>
    );
  }

  // Voice Steps (1-3)
  if (step >= 1 && step <= 3) {
    const currentStepIndex = step - 1;
    const currentStep = steps[currentStepIndex];
    const progress = (step / 3) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-2xl font-semibold">Step {step} of 3</span>
              <span className="text-white text-xl">चरण {step} / 3</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-4">
              <div
                className="bg-white h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center">
            {/* Question */}
            <h2 className="text-5xl font-bold text-white mb-4">
              {currentStep.questionHindi}
            </h2>
            <p className="text-3xl text-white/90 mb-12">
              {currentStep.question}
            </p>

            {/* Visual State */}
            <div className="mb-8">
              {isSpeaking && (
                <div className="flex justify-center items-center space-x-2 mb-6">
                  <div className="text-purple-300 text-6xl animate-pulse">🤖</div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-2 bg-white rounded-full animate-sound-wave"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {isListening && (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                    <Mic size={120} className="text-white relative animate-pulse" />
                  </div>
                  <p className="text-3xl text-white font-bold mt-6 animate-pulse">
                    Listening... सुन रहे हैं...
                  </p>
                </div>
              )}

              {!isSpeaking && !isListening && capturedData[currentStep.field] && (
                <div className="flex flex-col items-center">
                  <Check size={120} className="text-green-400" />
                  <p className="text-2xl text-white font-bold mt-4">Captured! कैप्चर किया गया!</p>
                </div>
              )}

              {error && !isListening && !isSpeaking && (
                <div className="mb-6">
                  <p className="text-red-300 text-xl mb-4">{error}</p>
                  <button
                    onClick={retryCurrentStep}
                    className="bg-white text-blue-600 px-8 py-4 rounded-full text-2xl font-bold hover:scale-110 transform transition-all"
                  >
                    🔄 Retry
                  </button>
                </div>
              )}
            </div>

            {/* Captured Data Display */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  className={`
                    p-4 rounded-xl transition-all
                    ${capturedData[s.field]
                      ? 'bg-green-500/30 border-2 border-green-400'
                      : idx < currentStepIndex
                      ? 'bg-white/10'
                      : idx === currentStepIndex
                      ? 'bg-blue-500/30 border-2 border-blue-400'
                      : 'bg-white/5'
                    }
                  `}
                >
                  <div className="text-white font-semibold mb-2">{s.question}</div>
                  {capturedData[s.field] && (
                    <div className="text-white text-xl font-bold break-words">
                      {capturedData[s.field]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Restart Button */}
          <div className="text-center mt-6">
            <button
              onClick={restart}
              className="text-white hover:bg-white/20 px-8 py-3 rounded-lg text-xl transition-colors"
            >
              <RotateCcw size={20} className="inline mr-2" />
              Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Review Screen (Step 4)
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <h1 className="text-5xl font-bold text-white text-center mb-8">
            Review Your Complaint
          </h1>
          <h2 className="text-4xl font-semibold text-white/90 text-center mb-12">
            अपनी शिकायत की समीक्षा करें
          </h2>

          <div className="space-y-6 mb-8">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-5xl">👤</div>
                <div>
                  <div className="text-gray-600 text-xl">Name • नाम</div>
                  <div className="text-3xl font-bold text-gray-900">{capturedData.name}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-start space-x-4 mb-4">
                <div className="text-5xl">🗣️</div>
                <div>
                  <div className="text-gray-600 text-xl">Problem • समस्या</div>
                  <div className="text-2xl font-bold text-gray-900">{capturedData.issue}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-5xl">📍</div>
                <div>
                  <div className="text-gray-600 text-xl">Address • पता</div>
                  <div className="text-3xl font-bold text-gray-900">{capturedData.address}</div>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border-2 border-white">
              <div className="flex items-center space-x-4">
                <Camera size={48} className="text-white" />
                <div className="text-white">
                  <div className="text-2xl font-bold">Photo Captured</div>
                  <div className="text-xl">फोटो कैप्चर की गई</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-6">
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-12 py-6 rounded-full text-3xl font-bold shadow-2xl hover:scale-110 transform transition-all duration-300"
            >
              ✓ Submit • जमा करें
            </button>

            <button
              onClick={restart}
              className="bg-white/20 backdrop-blur-md text-white px-12 py-6 rounded-full text-3xl font-bold hover:bg-white/30 transition-all border-2 border-white"
            >
              <RotateCcw size={32} className="inline mr-2" />
              Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RuralKiosk;
