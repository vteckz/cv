export class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.utterance = null;
    this.isSpeaking = false;
    this.onSpeakingChange = null;
  }

  async init() {
    // Wait for voices to load
    return new Promise(resolve => {
      const loadVoices = () => {
        const voices = this.synth.getVoices();

        // Prefer high-quality voices
        // Priority: Google UK English Male > Microsoft voices > Any English male voice
        const preferredVoices = [
          'Google UK English Male',
          'Microsoft Ryan Online (Natural)',
          'Microsoft Guy Online (Natural)',
          'Daniel',
          'Alex',
          'English (United Kingdom)',
          'en-GB'
        ];

        for (const preferred of preferredVoices) {
          const found = voices.find(v =>
            v.name.includes(preferred) ||
            v.lang.includes(preferred)
          );
          if (found) {
            this.voice = found;
            break;
          }
        }

        // Fallback to any English voice
        if (!this.voice) {
          this.voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        }

        resolve();
      };

      if (this.synth.getVoices().length) {
        loadVoices();
      } else {
        this.synth.onvoiceschanged = loadVoices;
      }
    });
  }

  async speak(text) {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synth.cancel();

      this.utterance = new SpeechSynthesisUtterance(text);

      if (this.voice) {
        this.utterance.voice = this.voice;
      }

      // Natural speech settings
      this.utterance.rate = 0.95; // Slightly slower for clarity
      this.utterance.pitch = 1.0;
      this.utterance.volume = 1.0;

      this.utterance.onstart = () => {
        this.isSpeaking = true;
        if (this.onSpeakingChange) {
          this.onSpeakingChange(true);
        }
      };

      this.utterance.onend = () => {
        this.isSpeaking = false;
        if (this.onSpeakingChange) {
          this.onSpeakingChange(false);
        }
        resolve();
      };

      this.utterance.onerror = (event) => {
        this.isSpeaking = false;
        if (this.onSpeakingChange) {
          this.onSpeakingChange(false);
        }
        // Don't reject on cancel
        if (event.error !== 'canceled') {
          console.warn('Speech synthesis error:', event.error);
        }
        resolve();
      };

      // Chrome bug workaround: speech stops after ~15 seconds
      // Chunk text into sentences
      this.synth.speak(this.utterance);

      // Keep speech alive on Chrome
      this.keepAlive();
    });
  }

  keepAlive() {
    // Chrome pauses speech synthesis after ~15s
    // This workaround resumes it
    if (this.isSpeaking) {
      this.synth.pause();
      this.synth.resume();
      setTimeout(() => this.keepAlive(), 10000);
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    if (this.onSpeakingChange) {
      this.onSpeakingChange(false);
    }
  }

  pause() {
    if (this.synth && this.isSpeaking) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  setOnSpeakingChange(callback) {
    this.onSpeakingChange = callback;
  }
}

export default SpeechEngine;
