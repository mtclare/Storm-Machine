class StormAudioEngine {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.sounds = {
            wind: { gainNode: null, source: null, buffer: null, isLooping: false },
            rain: { gainNode: null, source: null, buffer: null, isLooping: false },
            thunder: { gainNode: null, buffers: [], lastTrigger: 0 },
            lightning: { gainNode: null, buffers: [], lastTrigger: 0 }
        };
        this.masterGain = null;
        this.analyser = null;
        this.frequencyData = null;
        
        // Audio file URLs - replace these with your downloaded files
        this.audioFiles = {
            wind: [
                'https://www.soundjay.com/misc/sounds/wind-1.mp3', // Replace with local file
                'sounds/wind-loop.mp3' // Local file example
            ],
            rain: [
                'https://www.soundjay.com/rain/sounds/rain-1.mp3', // Replace with local file
                'sounds/rain-loop.mp3' // Local file example
            ],
            thunder: [
                'sounds/thunder-1.mp3', // Local files
                'sounds/thunder-2.mp3',
                'sounds/thunder-3.mp3'
            ],
            lightning: [
                'sounds/lightning-1.mp3', // Local files
                'sounds/lightning-2.mp3'
            ]
        };
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
            await this.loadAudioFiles();
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

    async loadAudioFiles() {
        console.log('Loading audio files...');
        
        for (const [soundType, urls] of Object.entries(this.audioFiles)) {
            if (soundType === 'thunder' || soundType === 'lightning') {
                // Load multiple variations for random effects
                this.sounds[soundType].buffers = [];
                for (const url of urls) {
                    try {
                        const buffer = await this.loadAudioBuffer(url);
                        this.sounds[soundType].buffers.push(buffer);
                    } catch (error) {
                        console.warn(`Failed to load ${soundType} file ${url}:`, error);
                    }
                }
            } else {
                // Load primary looping sound
                try {
                    const buffer = await this.loadAudioBuffer(urls[0]);
                    this.sounds[soundType].buffer = buffer;
                } catch (error) {
                    console.warn(`Failed to load ${soundType} file:`, error);
                    // Fallback to synthesized sound if file loading fails
                    this.sounds[soundType].buffer = this.createFallbackSound(soundType);
                }
            }
        }
        
        console.log('Audio files loaded successfully');
    }

    async loadAudioBuffer(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch audio file: ${url}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(arrayBuffer);
    }

    createFallbackSound(soundType) {
        // Create fallback synthesized sounds if files don't load
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        if (soundType === 'wind') {
            // Low frequency wind noise
            for (let i = 0; i < bufferSize; i++) {
                const noise = (Math.random() * 2 - 1) * 0.3;
                const lowFreq = Math.sin(2 * Math.PI * 60 * i / this.audioContext.sampleRate) * 0.2;
                output[i] = noise + lowFreq;
            }
        } else if (soundType === 'rain') {
            // High frequency rain noise
            for (let i = 0; i < bufferSize; i++) {
                const noise = (Math.random() * 2 - 1) * 0.4;
                const filtered = noise * (0.5 + 0.5 * Math.sin(2 * Math.PI * 800 * i / this.audioContext.sampleRate));
                output[i] = filtered;
            }
        }
        
        return buffer;
    }

    startLoopingSound(soundType, intensity) {
        const soundData = this.sounds[soundType];
        
        // Stop existing source
        if (soundData.source) {
            soundData.source.stop();
            soundData.source = null;
        }

        if (!soundData.buffer || intensity <= 0) return;

        // Create new buffer source
        soundData.source = this.audioContext.createBufferSource();
        soundData.source.buffer = soundData.buffer;
        soundData.source.loop = true;
        
        // Set volume based on intensity
        soundData.gainNode.gain.value = intensity * 0.7;
        
        // Connect and start
        soundData.source.connect(soundData.gainNode);
        soundData.source.start();
        soundData.isLooping = true;
    }

    stopLoopingSound(soundType) {
        const soundData = this.sounds[soundType];
        
        if (soundData.source) {
            soundData.source.stop();
            soundData.source = null;
            soundData.isLooping = false;
        }
        
        soundData.gainNode.gain.value = 0;
    }

    triggerRandomSound(soundType, intensity) {
        const now = this.audioContext.currentTime;
        const soundData = this.sounds[soundType];
        
        // Prevent rapid triggering
        const minInterval = soundType === 'thunder' ? 0.5 : 0.3;
        if (now - soundData.lastTrigger < minInterval) return;
        
        soundData.lastTrigger = now;
        
        if (!soundData.buffers || soundData.buffers.length === 0) {
            // Fallback to original synthesis if no audio files
            if (soundType === 'thunder') {
                this.triggerThunderSynthesis(intensity);
            } else if (soundType === 'lightning') {
                this.triggerLightningSynthesis(intensity);
            }
            return;
        }

        // Select random buffer
        const randomBuffer = soundData.buffers[Math.floor(Math.random() * soundData.buffers.length)];
        
        // Create source and play
        const source = this.audioContext.createBufferSource();
        source.buffer = randomBuffer;
        
        const tempGain = this.audioContext.createGain();
        tempGain.gain.value = intensity * 0.8;
        
        source.connect(tempGain);
        tempGain.connect(soundData.gainNode);
        
        source.start();
    }

    // Fallback synthesis methods (original code)
    triggerThunderSynthesis(intensity) {
        const now = this.audioContext.currentTime;
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

    triggerLightningSynthesis(intensity) {
        const now = this.audioContext.currentTime;
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

    createWhiteNoise() {
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        return buffer;
    }

    setMasterVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = volume;
        }
    }

    setSoundLevel(soundType, level) {
        if (!this.sounds[soundType] || !this.sounds[soundType].gainNode) return;

        switch (soundType) {
            case 'wind':
            case 'rain':
                if (level > 0) {
                    this.startLoopingSound(soundType, level);
                } else {
                    this.stopLoopingSound(soundType);
                }
                break;
            case 'thunder':
            case 'lightning':
                this.sounds[soundType].gainNode.gain.value = level;
                break;
        }
    }

    triggerThunder(intensity) {
        this.triggerRandomSound('thunder', intensity);
    }

    triggerLightning(intensity) {
        this.triggerRandomSound('lightning', intensity);
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
        this.stopLoopingSound('wind');
        this.stopLoopingSound('rain');
        this.isPlaying = false;
    }
}