class AmbientSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private currentType: string | null = null;
  private bellInterval: any = null;
  private dripInterval: any = null;
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {}

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.generateNoiseBuffer();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private generateNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  public start(type: string, volume: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.currentType === type) return; // Already running
    this.stop();

    this.currentType = type;
    this.setVolume(volume);

    switch (type) {
      case 'mountain-wind':
        this.playWind();
        break;
      case 'temple-bells':
        this.playBells();
        break;
      case 'desert-drone':
        this.playDesertDrone();
        break;
      case 'forest-birds':
        this.playForest();
        break;
      case 'ocean-waves':
        this.playWaves();
        break;
      case 'cave-resonance':
        this.playCave();
        break;
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.1);
    }
  }

  public stop() {
    // Clear intervals
    if (this.bellInterval) clearInterval(this.bellInterval);
    if (this.dripInterval) clearInterval(this.dripInterval);

    // Stop all nodes
    this.activeNodes.forEach((node: any) => {
      try {
        node.stop?.();
        node.disconnect?.();
      } catch (e) {}
    });
    this.activeNodes = [];
    this.currentType = null;
  }

  // --- SOUND GENERATORS ---

  private playWind() {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    // Wind noise source
    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;

    // Highpass to remove muddy lows
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(100, this.ctx.currentTime);

    // Bandpass to sweep frequency
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    // Slow sweep LFO
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // very slow

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime); // Sweep range

    // Connect LFO to filter frequency
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);

    // Dynamic wind volume swell
    const swellLfo = this.ctx.createOscillator();
    swellLfo.type = 'sine';
    swellLfo.frequency.setValueAtTime(0.05, this.ctx.currentTime);

    const swellGainNode = this.ctx.createGain();
    swellGainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
    
    // Connect swell
    swellLfo.connect(swellGainNode);
    
    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    // Connect swell to gain node gain
    swellGainNode.connect(windGain.gain);

    // Routing
    source.connect(hp);
    hp.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.masterGain);

    // Start nodes
    source.start();
    lfo.start();
    swellLfo.start();

    this.activeNodes.push(source, lfo, swellLfo, filter, windGain, hp, lfoGain, swellGainNode);
  }

  private playWaves() {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;

    // Filter for wave sounds (low/mid frequency focus)
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(350, this.ctx.currentTime);

    // Modulate volume for wave rolling in and out
    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.05, this.ctx.currentTime);

    const volumeLfo = this.ctx.createOscillator();
    volumeLfo.type = 'sine';
    volumeLfo.frequency.setValueAtTime(0.09, this.ctx.currentTime); // ~11s cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    // Connect LFO to control the wave gain
    volumeLfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    source.connect(lp);
    lp.connect(waveGain);
    waveGain.connect(this.masterGain);

    source.start();
    volumeLfo.start();

    this.activeNodes.push(source, volumeLfo, waveGain, lp, lfoGain);
  }

  private playDesertDrone() {
    if (!this.ctx || !this.masterGain) return;

    // 3 Detuned sawtooth oscillators for rich warm drone
    const freqs = [55.0, 110.0, 110.5]; // A1, A2
    const oscs = freqs.map((freq) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
      return osc;
    });

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, this.ctx.currentTime);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    oscs.forEach((osc) => {
      osc.connect(filter);
      osc.start();
      this.activeNodes.push(osc);
    });

    filter.connect(droneGain);
    droneGain.connect(this.masterGain);
    this.activeNodes.push(filter, droneGain);
  }

  private triggerBell(freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Metallic partials for realistic chime bell sound
    const partials = [1.0, 1.5, 2.0, 2.7, 3.8];
    const gains = [0.2, 0.12, 0.08, 0.05, 0.03];

    partials.forEach((mult, index) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * mult, now);

      const gainNode = this.ctx!.createGain();
      gainNode.gain.setValueAtTime(gains[index], now);
      // Bell decay envelope
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 5.0 / mult);

      osc.connect(gainNode);
      gainNode.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 6.0);

      // Clean up nodes after ring is done
      setTimeout(() => {
        osc.disconnect();
        gainNode.disconnect();
      }, 7000);
    });
  }

  private playBells() {
    if (!this.ctx) return;
    // Play a low deep temple drone as background
    this.playDesertDrone(); // Low background hum

    // Trigger random temple chimes
    const triggerRandomBell = () => {
      const pitches = [180, 220, 270, 330];
      const pitch = pitches[Math.floor(Math.random() * pitches.length)];
      this.triggerBell(pitch);
    };

    triggerRandomBell();
    this.bellInterval = setInterval(triggerRandomBell, 8000);
  }

  private playForest() {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    // Wind background
    this.playWind();

    // High pitched bird chirp generator
    const triggerChirp = () => {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const baseFreq = 2200 + Math.random() * 800;

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);

      const mod = this.ctx.createOscillator();
      mod.type = 'sine';
      mod.frequency.setValueAtTime(35, now); // Chirp warble frequency

      const modGain = this.ctx.createGain();
      modGain.gain.setValueAtTime(200, now);

      const chirpGain = this.ctx.createGain();
      chirpGain.gain.setValueAtTime(0.005, now);
      chirpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      mod.connect(modGain);
      modGain.connect(osc.frequency);
      osc.connect(chirpGain);
      chirpGain.connect(this.masterGain);

      mod.start(now);
      osc.start(now);
      mod.stop(now + 0.2);
      osc.stop(now + 0.2);

      setTimeout(() => {
        mod.disconnect();
        modGain.disconnect();
        osc.disconnect();
        chirpGain.disconnect();
      }, 300);
    };

    this.dripInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        triggerChirp();
        if (Math.random() > 0.6) {
          setTimeout(triggerChirp, 150);
        }
      }
    }, 4000);
  }

  private playCave() {
    if (!this.ctx || !this.masterGain) return;

    // Low rumble base drone
    const lowOsc = this.ctx.createOscillator();
    lowOsc.type = 'sine';
    lowOsc.frequency.setValueAtTime(45.0, this.ctx.currentTime);
    
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(80, this.ctx.currentTime);

    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    lowOsc.connect(lp);
    lp.connect(rumbleGain);
    rumbleGain.connect(this.masterGain);
    lowOsc.start();
    this.activeNodes.push(lowOsc, lp, rumbleGain);

    // Cave echo node
    const delay = this.ctx.createDelay();
    delay.delayTime.setValueAtTime(0.45, this.ctx.currentTime);

    const delayFeedback = this.ctx.createGain();
    delayFeedback.gain.setValueAtTime(0.4, this.ctx.currentTime);

    delay.connect(delayFeedback);
    delayFeedback.connect(delay); // Loop
    delay.connect(this.masterGain);
    this.activeNodes.push(delay, delayFeedback);

    // Random water drip droplets
    const triggerDrip = () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const pitch = 800 + Math.random() * 1200;

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, now + 0.08); // pitch bend drip

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(gain);
      gain.connect(delay); // Send to echo

      osc.start(now);
      osc.stop(now + 0.2);

      setTimeout(() => {
        osc.disconnect();
        gain.disconnect();
      }, 1000);
    };

    this.dripInterval = setInterval(triggerDrip, 3000);
  }
}

// Singleton instances - only in browser environment
export const audioSynth = typeof window !== 'undefined' ? new AmbientSynth() : null;
export default audioSynth;
