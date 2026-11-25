export class SoundService {
  private static audioCtx: AudioContext | null = null;
  private static preloadedAudio: Record<string, HTMLAudioElement> = {};

  // Initialize and preload audio files
  private static init() {
    if (typeof window === 'undefined') return;
    if (Object.keys(this.preloadedAudio).length === 0) {
      const sounds = ['move', 'capture', 'castle', 'check', 'checkmate'];
      sounds.forEach(name => {
        try {
          const audio = new Audio(`/sounds/${name}.wav`);
          audio.preload = 'auto';
          this.preloadedAudio[name] = audio;
        } catch {
          // ignore
        }
      });
    }
  }

  private static playAudioFile(name: string, fallbackFn: () => void) {
    if (typeof window === 'undefined') return;
    this.init();

    try {
      // Create a fresh clone or reuse for overlapping snappy sounds
      const base = this.preloadedAudio[name];
      if (base) {
        const sound = base.cloneNode() as HTMLAudioElement;
        sound.volume = 0.95;
        const promise = sound.play();
        if (promise) {
          promise.catch(() => {
            // If browser blocks audio file or missing, use realistic physical synthesis
            fallbackFn();
          });
        }
        return;
      }
    } catch {
      // fallback
    }

    fallbackFn();
  }

  private static getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // ==========================================
  // REALISTIC WOODEN MOVE SOUND
  // ==========================================
  public static playMove() {
    this.playAudioFile('move', () => {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Dry wood impact transient (noise click)
      const bufferSize = ctx.sampleRate * 0.015; // 15ms click
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.003));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1400, now);
      noiseFilter.Q.setValueAtTime(1.8, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.45, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // 2. Warm wooden board body resonance (200 Hz "thock")
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(170, now + 0.07);

      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    });
  }

  // ==========================================
  // REALISTIC WOODEN CAPTURE SOUND (Clack-Thud)
  // ==========================================
  public static playCapture() {
    this.playAudioFile('capture', () => {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // First piece collision clack
      const clackOsc = ctx.createOscillator();
      const clackGain = ctx.createGain();
      clackOsc.type = 'triangle';
      clackOsc.frequency.setValueAtTime(850, now);
      clackOsc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
      clackGain.gain.setValueAtTime(0.4, now);
      clackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      clackOsc.connect(clackGain);
      clackGain.connect(ctx.destination);
      clackOsc.start(now);
      clackOsc.stop(now + 0.04);

      // Second board impact thud (20ms later)
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(210, now + 0.02);
      thudOsc.frequency.exponentialRampToValueAtTime(140, now + 0.09);
      thudGain.gain.setValueAtTime(0.001, now);
      thudGain.gain.setValueAtTime(0.45, now + 0.02);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(now + 0.02);
      thudOsc.stop(now + 0.09);
    });
  }

  // ==========================================
  // REALISTIC CASTLE SOUND (Double piece movement)
  // ==========================================
  public static playCastle() {
    this.playAudioFile('castle', () => {
      this.playMove();
      setTimeout(() => this.playMove(), 110);
    });
  }

  // ==========================================
  // REALISTIC CHECK SOUND (Wood strike + alert overtone)
  // ==========================================
  public static playCheck() {
    this.playAudioFile('check', () => {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Wood thock
      this.playMove();

      // Resonant harmonic alert ping
      const ping1 = ctx.createOscillator();
      const pingGain = ctx.createGain();
      ping1.type = 'sine';
      ping1.frequency.setValueAtTime(587.33, now); // D5
      pingGain.gain.setValueAtTime(0.2, now);
      pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      ping1.connect(pingGain);
      pingGain.connect(ctx.destination);
      ping1.start(now);
      ping1.stop(now + 0.18);
    });
  }

  // ==========================================
  // REALISTIC CHECKMATE SOUND (Decisive gavel strike)
  // ==========================================
  public static playCheckmate() {
    this.playAudioFile('checkmate', () => {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.35);
      oscGain.gain.setValueAtTime(0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    });
  }

  // ==========================================
  // DIGITAL CHESS CLOCK SOUNDS
  // ==========================================
  public static playLowTimeWarning() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5 alert tick
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  public static playTimeout() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Dual buzzer descending tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(320, now);
    osc1.frequency.exponentialRampToValueAtTime(160, now + 0.4);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);
  }
}
