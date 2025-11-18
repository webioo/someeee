// Voice Synthesis - Text to Speech (Hindi)
export const speakHindi = (text, hindiText) => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(hindiText || text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => resolve();
    utterance.onerror = (error) => reject(error);

    window.speechSynthesis.speak(utterance);
  });
};

// Voice Recognition - Speech to Text (Hindi)
export const listenHindi = () => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      reject(new Error('Speech recognition not supported'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event) => {
      reject(new Error(event.error));
    };

    recognition.onend = () => {
      // If no result was captured, reject
      setTimeout(() => {
        reject(new Error('No speech detected'));
      }, 100);
    };

    recognition.start();
  });
};

// Check browser support
export const checkVoiceSupport = () => {
  const hasSpeechSynthesis = 'speechSynthesis' in window;
  const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  return {
    supported: hasSpeechSynthesis && hasSpeechRecognition,
    synthesis: hasSpeechSynthesis,
    recognition: hasSpeechRecognition
  };
};

// Stop any ongoing speech
export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
