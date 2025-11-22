
let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const playTone = (freq: number, type: OscillatorType, duration: number, delay: number = 0, vol: number = 0.1) => {
  try {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = freq;
    
    const t = ctx.currentTime + delay;
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(t);
    osc.stop(t + duration);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const SystemSounds = {
  playStartup: () => {
    // A welcoming ascending major chord
    playTone(261.63, 'sine', 2, 0, 0.1); // C4
    playTone(329.63, 'sine', 2, 0.2, 0.1); // E4
    playTone(392.00, 'sine', 3, 0.4, 0.1); // G4
    playTone(523.25, 'sine', 4, 0.6, 0.08); // C5
  },
  playNotification: () => {
    // High pitched "ding"
    playTone(880, 'sine', 0.6, 0, 0.05);
    playTone(1760, 'sine', 0.4, 0.1, 0.03);
  },
  playError: () => {
    // Low buzz "bonk"
    playTone(150, 'sawtooth', 0.2, 0, 0.08);
    playTone(100, 'sawtooth', 0.2, 0.05, 0.08);
  },
  playWindowOpen: () => {
     // Ascending slide
     const ctx = getContext();
     if (!ctx) return;
     if (ctx.state === 'suspended') ctx.resume();
     const osc = ctx.createOscillator();
     const gain = ctx.createGain();
     osc.frequency.setValueAtTime(300, ctx.currentTime);
     osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
     gain.gain.setValueAtTime(0.05, ctx.currentTime);
     gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
     osc.connect(gain);
     gain.connect(ctx.destination);
     osc.start();
     osc.stop(ctx.currentTime + 0.15);
  },
  playWindowClose: () => {
     // Descending slide
     const ctx = getContext();
     if (!ctx) return;
     if (ctx.state === 'suspended') ctx.resume();
     const osc = ctx.createOscillator();
     const gain = ctx.createGain();
     osc.frequency.setValueAtTime(500, ctx.currentTime);
     osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
     gain.gain.setValueAtTime(0.05, ctx.currentTime);
     gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
     osc.connect(gain);
     gain.connect(ctx.destination);
     osc.start();
     osc.stop(ctx.currentTime + 0.15);
  },
  playClick: () => {
      playTone(800, 'sine', 0.05, 0, 0.02);
  }
};
