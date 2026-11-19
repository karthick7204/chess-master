type VoiceStateCallback = (state: { isPlaying: boolean; isPaused: boolean }) => void;

export class VoiceService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static enabled: boolean = true;
  private static isPausedState: boolean = false;
  private static isSpeakingState: boolean = false;
  private static stateListeners: Set<VoiceStateCallback> = new Set();
  private static cachedVoice: SpeechSynthesisVoice | null = null;

  public static subscribe(callback: VoiceStateCallback): () => void {
    this.stateListeners.add(callback);
    callback({ isPlaying: this.isSpeakingState, isPaused: this.isPausedState });
    return () => {
      this.stateListeners.delete(callback);
    };
  }

  private static notifyState() {
    this.stateListeners.forEach(cb => cb({
      isPlaying: this.isSpeakingState,
      isPaused: this.isPausedState
    }));
  }

  public static setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled && this.synth) {
      this.cancel();
    }
  }

  public static isEnabled(): boolean {
    return this.enabled;
  }

  public static isPaused(): boolean {
    return this.isPausedState;
  }

  public static isPlaying(): boolean {
    return this.isSpeakingState && !this.isPausedState;
  }

  public static pause() {
    if (!this.synth) return;
    try {
      this.synth.pause();
      this.isPausedState = true;
      this.notifyState();
    } catch (e) {
      console.warn('Speech pause error:', e);
    }
  }

  public static resume() {
    if (!this.synth) return;
    try {
      this.synth.resume();
      this.isPausedState = false;
      this.notifyState();
    } catch (e) {
      console.warn('Speech resume error:', e);
    }
  }

  public static cancel() {
    if (!this.synth) return;
    try {
      this.synth.cancel();
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.notifyState();
    } catch (e) {
      console.warn('Speech cancel error:', e);
    }
  }

  // Prepares clear, natural chess phonetic reading without robotic glitches
  public static cleanChessSpeech(text: string): string {
    return text
      // Remove emojis
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      // Remove raw ECO brackets e.g. "(ECO C65)" or "(ECO B00)"
      .replace(/\(ECO\s+[A-E0-9]+\)/gi, '')
      .replace(/ECO\s+[A-E0-9]+/gi, '')
      // Standard chess notation to natural speech
      .replace(/O-O-O/g, 'queenside castling')
      .replace(/O-O/g, 'kingside castling')
      // Piece captures
      .replace(/N([a-h][1-8])/g, 'Knight to $1')
      .replace(/B([a-h][1-8])/g, 'Bishop to $1')
      .replace(/R([a-h][1-8])/g, 'Rook to $1')
      .replace(/Q([a-h][1-8])/g, 'Queen to $1')
      .replace(/K([a-h][1-8])/g, 'King to $1')
      .replace(/([a-h])x([a-h][1-8])/g, '$1 takes $2')
      .replace(/([NBRQK])x([a-h][1-8])/g, '$1 takes $2')
      .replace(/\+/g, ' check')
      .replace(/#/g, ' checkmate')
      // Clean up whitespace & punctuation
      .replace(/::/g, ':')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static getBestVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    if (this.cachedVoice) return this.cachedVoice;

    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prefer high-quality, clear, natural English voices (especially on macOS / Chrome)
    const preferredNames = [
      'Samantha',
      'Daniel',
      'Karen',
      'Serena',
      'Tessa',
      'Oliver',
      'Ava',
      'Google US English',
      'Microsoft Zira',
      'Microsoft David'
    ];

    for (const name of preferredNames) {
      const match = voices.find(v => v.name.includes(name) && v.lang.startsWith('en'));
      if (match) {
        this.cachedVoice = match;
        return match;
      }
    }

    // Fallback: any English voice that is not compact
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('compact'));
    if (naturalVoice) {
      this.cachedVoice = naturalVoice;
      return naturalVoice;
    }

    return voices.find(v => v.lang.startsWith('en')) || null;
  }

  // Speaks text and invokes onComplete when finished (or on error)
  public static speakAndThen(text: string, onComplete?: () => void) {
    if (!this.enabled || !this.synth) {
      if (onComplete) onComplete();
      return;
    }

    try {
      this.cancel();

      const cleanedText = this.cleanChessSpeech(text);
      if (!cleanedText) {
        if (onComplete) onComplete();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      const voice = this.getBestVoice();
      if (voice) {
        utterance.voice = voice;
      }

      // Steady, clear, composed coach pacing
      utterance.rate = 0.94;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      this.isSpeakingState = true;
      this.isPausedState = false;
      this.notifyState();

      let isFinished = false;
      const finish = () => {
        if (isFinished) return;
        isFinished = true;
        this.isSpeakingState = false;
        this.isPausedState = false;
        this.notifyState();
        if (onComplete) onComplete();
      };

      utterance.onend = finish;
      utterance.onerror = (e) => {
        console.warn('Speech synthesis ended with error:', e);
        finish();
      };

      // Safety timeout based on text length in case browser stalls
      const estimatedDuration = Math.max(2500, (cleanedText.split(' ').length / 2.5) * 1000 + 1000);
      const safetyTimer = setTimeout(() => {
        if (!isFinished && !this.isPausedState) {
          finish();
        }
      }, estimatedDuration + 3000);

      const originalFinish = finish;
      utterance.onend = () => {
        clearTimeout(safetyTimer);
        originalFinish();
      };

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Voice speak error:', e);
      if (onComplete) onComplete();
    }
  }

  public static speak(text: string) {
    this.speakAndThen(text);
  }
}
