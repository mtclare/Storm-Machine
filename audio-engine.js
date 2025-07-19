class StormAudioEngine {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.sounds = {
            wind: { gainNode: null, oscillator: null, filter: null, noise: null },
            rain: { gainNode: null, source: null, filter: null },
            thunder: { gainNode: null, lastTrigger: 0 },
            lightning: { gainNode: null, lastTrigger: 0 }
        };
        this.masterGain = null;
        this.analyser = null;
        this.frequencyData = null;
    }

    async initialize() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.analyser = this.audioContext.createAnalyser();
            
            this.masterGain.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            this.analyser.fftSize = 256;
            this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
            
            this.setupSounds();
            return true;
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
            return false;
        }
    }

    setupSounds() {
        Object.keys(this.sounds).forEach(soundType => {
            this.sounds[soundType].gainNode = this.audioContext.createGain();
            this.sounds[soundType].gainNode.gain.value = 0;
            this.sounds[soundType].gainNode.connect(this.masterGain);
        });
    }

    createWhiteNoise() {
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        return buffer;
    }

    async startWind(intensity) {
        if (this.sounds.wind.oscillator) {
            this.stopWind();
        }

        const windGain = this.sounds.wind.gainNode;
        windGain.gain.value = intensity * 0.3;

        const lowFreqOsc = this.audioContext.createOscillator();
        lowFreqOsc.type = 'sawtooth';
        lowFreqOsc.frequency.value = 60 + intensity * 40;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200 + intensity * 300;
        filter.Q.value = 1;

        const noiseSource = this.audioContext.createBufferSource();
        noiseSource.buffer = this.createWhiteNoise();
        noiseSource.loop = true;

        const noiseFilter = this.audioContext.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 100 + intensity * 200;

        const noiseGain = this.audioContext.createGain();
        noiseGain.gain.value = intensity * 0.2;

        lowFreqOsc.connect(filter);
        filter.connect(windGain);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(windGain);

        lowFreqOsc.start();
        noiseSource.start();

        this.sounds.wind.oscillator = lowFreqOsc;
        this.sounds.wind.filter = filter;
        this.sounds.wind.noise = noiseSource;
    }

    stopWind() {
        if (this.sounds.wind.oscillator) {
            this.sounds.wind.oscillator.stop();
            this.sounds.wind.oscillator = null;
        }
        if (this.sounds.wind.noise) {
            this.sounds.wind.noise.stop();
            this.sounds.wind.noise = null;
        }
    }

    async startRain(intensity) {
        if (this.sounds.rain.source) {
            this.stopRain();
        }

        const rainGain = this.sounds.rain.gainNode;
        rainGain.gain.value = intensity * 0.4;

        const noiseSource = this.audioContext.createBufferSource();
        noiseSource.buffer = this.createWhiteNoise();
        noiseSource.loop = true;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800 + intensity * 1200;
        filter.Q.value = 0.5;

        const filter2 = this.audioContext.createBiquadFilter();
        filter2.type = 'highpass';
        filter2.frequency.value = 400 + intensity * 600;

        noiseSource.connect(filter);
        filter.connect(filter2);
        filter2.connect(rainGain);

        noiseSource.start();
        this.sounds.rain.source = noiseSource;
        this.sounds.rain.filter = filter;
    }

    stopRain() {
        if (this.sounds.rain.source) {
            this.sounds.rain.source.stop();
            this.sounds.rain.source = null;
        }
    }

    triggerThunder(intensity) {
        const now = this.audioContext.currentTime;
        if (now - this.sounds.thunder.lastTrigger < 0.5) return;
        
        this.sounds.thunder.lastTrigger = now;

        const thunderGain = this.audioContext.createGain();
        thunderGain.gain.value = 0;
        thunderGain.connect(this.sounds.thunder.gainNode);

        const osc = this.audioContext.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = 30;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 100;

        osc.connect(filter);
        filter.connect(thunderGain);

        const attackTime = 0.01;
        const decayTime = 0.8 + intensity * 1.2;
        const sustainLevel = 0.1;
        const releaseTime = 1.5;

        thunderGain.gain.setValueAtTime(0, now);
        thunderGain.gain.linearRampToValueAtTime(intensity * 0.6, now + attackTime);
        thunderGain.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
        thunderGain.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime);

        osc.start(now);
        osc.stop(now + attackTime + decayTime + releaseTime);
    }

    triggerLightning(intensity) {
        const now = this.audioContext.currentTime;
        if (now - this.sounds.lightning.lastTrigger < 0.3) return;
        
        this.sounds.lightning.lastTrigger = now;

        const lightningGain = this.audioContext.createGain();
        lightningGain.gain.value = 0;
        lightningGain.connect(this.sounds.lightning.gainNode);

        const noiseSource = this.audioContext.createBufferSource();
        noiseSource.buffer = this.createWhiteNoise();

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2000 + intensity * 3000;
        filter.Q.value = 10;

        noiseSource.connect(filter);
        filter.connect(lightningGain);

        const duration = 0.05 + intensity * 0.1;
        
        lightningGain.gain.setValueAtTime(0, now);
        lightningGain.gain.linearRampToValueAtTime(intensity * 0.3, now + 0.001);
        lightningGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noiseSource.start(now);
        noiseSource.stop(now + duration);
    }

    setMasterVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = volume;
        }
    }

    setSoundLevel(soundType, level) {
        if (this.sounds[soundType] && this.sounds[soundType].gainNode) {
            switch (soundType) {
                case 'wind':
                    if (level > 0) {
                        this.startWind(level);
                    } else {
                        this.stopWind();
                        this.sounds.wind.gainNode.gain.value = 0;
                    }
                    break;
                case 'rain':
                    if (level > 0) {
                        this.startRain(level);
                    } else {
                        this.stopRain();
                        this.sounds.rain.gainNode.gain.value = 0;
                    }
                    break;
                case 'thunder':
                    this.sounds.thunder.gainNode.gain.value = level;
                    if (level > 0 && Math.random() < level * 0.02) {
                        this.triggerThunder(level);
                    }
                    break;
                case 'lightning':
                    this.sounds.lightning.gainNode.gain.value = level;
                    if (level > 0 && Math.random() < level * 0.03) {
                        this.triggerLightning(level);
                    }
                    break;
            }
        }
    }

    getFrequencyData() {
        if (this.analyser && this.frequencyData) {
            this.analyser.getByteFrequencyData(this.frequencyData);
            return this.frequencyData;
        }
        return null;
    }

    async start() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        this.isPlaying = true;
    }

    stop() {
        this.stopWind();
        this.stopRain();
        this.isPlaying = false;
    }
}