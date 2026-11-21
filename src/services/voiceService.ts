type VoiceStateCallback = (state: { isPlaying: boolean; isPaused: boolean }) => void;

export class VoiceService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static enabled: boolean = true;
  private static isPausedState: boolean = false;
  private static isSpeakingState: boolean = false;
  private static stateListeners: Set<VoiceStateCallback> = new Set();
  private static cachedVoice: SpeechSynthesisVoice | null = null;
  private static activeQueue: string[] = [];
  private static onCompleteCallback: (() => void) | null = null;
  private static pauseTimeout: ReturnType<typeof setTimeout> | null = null;

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
    if (!enabled) {
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
    if (this.pauseTimeout) {
      clearTimeout(this.pauseTimeout);
      this.pauseTimeout = null;
    }
    this.activeQueue = [];
    this.onCompleteCallback = null;
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Speech cancel error:', e);
      }
    }
    this.isSpeakingState = false;
    this.isPausedState = false;
    this.notifyState();
  }

  // Skip skips the remaining voice queue and immediately advances the game flow
  public static skip() {
    const cb = this.onCompleteCallback;
    this.cancel();
    if (cb) {
      cb();
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
      // Clean exclamation badges
      .replace(/!{2,}/g, '!')
      .replace(/\?{2,}/g, '?')
      // Standard chess notation to natural speech
      .replace(/O-O-O/g, 'queenside castling')
      .replace(/O-O/g, 'kingside castling')
      // Move translations: e.g. e4 -> E 4, Nf3 -> Knight to F 3
      .replace(/\bN([a-h])([1-8])\b/g, 'Knight to $1 $2')
      .replace(/\bB([a-h])([1-8])\b/g, 'Bishop to $1 $2')
      .replace(/\bR([a-h])([1-8])\b/g, 'Rook to $1 $2')
      .replace(/\bQ([a-h])([1-8])\b/g, 'Queen to $1 $2')
      .replace(/\bK([a-h])([1-8])\b/g, 'King to $1 $2')
      .replace(/\b([a-h])([1-8])\b/g, '$1 $2')
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

  // Splits text into natural conversational clauses for human-like pauses
  private static splitIntoClauses(text: string): string[] {
    // Split by sentence terminators or major punctuation
    const rawParts = text.split(/(?<=[.!?])\s+|(?<=:)\s+/);
    const clauses: string[] = [];

    for (const part of rawParts) {
      const trimmed = part.trim();
      if (trimmed.length > 0) {
        clauses.push(trimmed);
      }
    }

    return clauses.length > 0 ? clauses : [text];
  }

  // Speaks sequentially with human-like breathing pauses between clauses
  public static speakAndThen(text: string, onComplete?: () => void) {
    if (!this.enabled || !this.synth) {
      if (onComplete) onComplete();
      return;
    }

    this.cancel();

    const cleanedText = this.cleanChessSpeech(text);
    if (!cleanedText) {
      if (onComplete) onComplete();
      return;
    }

    const clauses = this.splitIntoClauses(cleanedText);
    this.activeQueue = [...clauses];
    this.onCompleteCallback = onComplete || null;

    this.isSpeakingState = true;
    this.isPausedState = false;
    this.notifyState();

    this.playNextClause();
  }

  private static playNextClause() {
    if (!this.synth || !this.enabled || this.activeQueue.length === 0) {
      const cb = this.onCompleteCallback;
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.onCompleteCallback = null;
      this.notifyState();
      if (cb) cb();
      return;
    }

    const nextText = this.activeQueue.shift()!;
    const utterance = new SpeechSynthesisUtterance(nextText);
    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Calm, steady, authoritative coach cadence (like Chess.com analysis)
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    let hasEnded = false;
    const onClauseEnd = () => {
      if (hasEnded) return;
      hasEnded = true;

      if (this.activeQueue.length > 0) {
        // Natural human breath pause between sentences (220ms - 280ms)
        this.pauseTimeout = setTimeout(() => {
          this.pauseTimeout = null;
          this.playNextClause();
        }, 240);
      } else {
        // Finished all clauses
        const cb = this.onCompleteCallback;
        this.isSpeakingState = false;
        this.isPausedState = false;
        this.onCompleteCallback = null;
        this.notifyState();
        if (cb) cb();
      }
    };

    utterance.onend = onClauseEnd;
    utterance.onerror = (e) => {
      console.warn('Clause speech error:', e);
      onClauseEnd();
    };

    // Safety timeout per clause
    const estimatedDuration = Math.max(1800, (nextText.split(' ').length / 2.2) * 1000 + 1000);
    const clauseTimer = setTimeout(() => {
      if (!hasEnded && !this.isPausedState) {
        onClauseEnd();
      }
    }, estimatedDuration + 2000);

    const origEnd = onClauseEnd;
    utterance.onend = () => {
      clearTimeout(clauseTimer);
      origEnd();
    };

    this.synth.speak(utterance);
  }

  public static speak(text: string) {
    this.speakAndThen(text);
  }
}
