// Audio System using Web Audio API for synthesized sound effects
// Generates "mechanical" clicks and "computing" chitter procedurally
// This avoids external asset dependencies while satisfying the "generated" requirement.

class AudioSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private thinkTimeout: number | null = null;
  private nextThinkTime: number = 0;

  constructor() {
    // Lazy init handled in methods
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopThinking();
    }
  }

  // Mechanical Switch Click
  public playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // 1. The "Click" (High frequency burst)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
    
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);

    // 2. The "Thock" (Low frequency body)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(200, t);
    osc2.frequency.exponentialRampToValueAtTime(50, t + 0.1);

    gain2.gain.setValueAtTime(0.05, t);
    gain2.gain.linearRampToValueAtTime(0, t + 0.1);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t);
    osc2.stop(t + 0.1);
  }

  // Thinking "Chitter" Loop
  // Schedules random bleeps to sound like data processing
  public startThinking() {
    if (this.isMuted || this.thinkTimeout) return;
    this.init();
    if (!this.ctx) return;

    this.nextThinkTime = this.ctx.currentTime;
    this.scheduleThinkBeep();
  }

  private scheduleThinkBeep() {
    if (this.isMuted || !this.ctx) return;

    const t = Math.max(this.ctx.currentTime, this.nextThinkTime);
    
    // Randomize the next beep
    const duration = 0.03 + Math.random() * 0.05; // 30ms - 80ms
    const frequency = 800 + Math.random() * 800; // 800Hz - 1600Hz
    const gap = 0.05 + Math.random() * 0.1; // 50ms - 150ms silence

    // Create the beep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
    osc.frequency.setValueAtTime(frequency, t);
    
    gain.gain.setValueAtTime(0.005, t); // Quiet
    gain.gain.linearRampToValueAtTime(0, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + duration);

    // Schedule next
    this.nextThinkTime = t + duration + gap;
    
    // Lookahead scheduler
    const delay = (this.nextThinkTime - this.ctx.currentTime) * 1000;
    this.thinkTimeout = window.setTimeout(() => this.scheduleThinkBeep(), Math.max(10, delay - 20));
  }

  public stopThinking() {
    if (this.thinkTimeout) {
      clearTimeout(this.thinkTimeout);
      this.thinkTimeout = null;
    }
  }
}

export const audioManager = new AudioSystem();