class StormApp {
    constructor() {
        this.audioEngine = new StormAudioEngine();
        this.isPlaying = false;
        this.dials = {};
        this.animationId = null;
        this.thunderTimer = null;
        this.lightningTimer = null;
        
        this.init();
    }

    async init() {
        this.setupDials();
        this.setupEventListeners();
        this.setupVisualizer();
        
        const success = await this.audioEngine.initialize();
        if (!success) {
            this.showError('Failed to initialize audio. Please refresh and try again.');
        }
    }

    setupDials() {
        const dialElements = document.querySelectorAll('.dial');
        
        dialElements.forEach(dial => {
            const soundType = dial.dataset.sound;
            const dialData = {
                element: dial,
                pointer: dial.querySelector('.dial-pointer'),
                isDragging: false,
                value: 0,
                angle: -135,
                soundType: soundType
            };
            
            this.dials[soundType] = dialData;
            this.setupDialInteraction(dialData);
        });
    }

    setupDialInteraction(dialData) {
        const { element, pointer } = dialData;
        
        const startDrag = (e) => {
            e.preventDefault();
            dialData.isDragging = true;
            element.classList.add('dragging');
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('touchend', endDrag);
        };

        const drag = (e) => {
            if (!dialData.isDragging) return;
            e.preventDefault();
            
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;
            
            let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            angle = (angle + 45) % 360;
            if (angle < 0) angle += 360;
            
            angle = Math.max(0, Math.min(270, angle));
            
            dialData.angle = angle - 135;
            dialData.value = angle / 270;
            
            this.updateDial(dialData);
        };

        const endDrag = () => {
            dialData.isDragging = false;
            element.classList.remove('dragging');
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', endDrag);
        };

        element.addEventListener('mousedown', startDrag);
        element.addEventListener('touchstart', startDrag, { passive: false });
    }

    updateDial(dialData) {
        const { pointer, value, angle, soundType } = dialData;
        
        pointer.style.transform = `rotate(${angle}deg)`;
        
        const percentage = Math.round(value * 100);
        const valueElement = document.getElementById(`${soundType}-value`);
        if (valueElement) {
            valueElement.textContent = `${percentage}%`;
        }
        
        const panel = document.querySelector(`[data-sound="${soundType}"]`);
        panel.style.setProperty('--intensity', value);
        
        if (this.isPlaying) {
            this.audioEngine.setSoundLevel(soundType, value);
        }
    }

    setupEventListeners() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        const masterVolumeSlider = document.getElementById('master-volume');
        const volumeValue = document.getElementById('volume-value');

        playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        masterVolumeSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value) / 100;
            this.audioEngine.setMasterVolume(volume);
            volumeValue.textContent = `${e.target.value}%`;
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlayPause();
            }
        });
    }

    async togglePlayPause() {
        const btn = document.getElementById('play-pause-btn');
        const btnIcon = btn.querySelector('.btn-icon');
        const btnText = btn.querySelector('.btn-text');
        
        if (!this.isPlaying) {
            await this.audioEngine.start();
            this.isPlaying = true;
            btnIcon.textContent = '⏸️';
            btnText.textContent = 'Pause Storm';
            
            Object.values(this.dials).forEach(dial => {
                if (dial.value > 0) {
                    this.audioEngine.setSoundLevel(dial.soundType, dial.value);
                }
            });
            
            this.startRandomEvents();
            this.startVisualization();
            
        } else {
            this.audioEngine.stop();
            this.isPlaying = false;
            btnIcon.textContent = '▶️';
            btnText.textContent = 'Start Storm';
            
            this.stopRandomEvents();
            this.stopVisualization();
        }
    }

    startRandomEvents() {
        this.thunderTimer = setInterval(() => {
            const thunderDial = this.dials.thunder;
            if (thunderDial.value > 0.1 && Math.random() < thunderDial.value * 0.3) {
                this.audioEngine.triggerThunder(thunderDial.value);
                this.flashEffect('thunder');
            }
        }, 2000);

        this.lightningTimer = setInterval(() => {
            const lightningDial = this.dials.lightning;
            if (lightningDial.value > 0.1 && Math.random() < lightningDial.value * 0.4) {
                this.audioEngine.triggerLightning(lightningDial.value);
                this.flashEffect('lightning');
            }
        }, 1500);
    }

    stopRandomEvents() {
        if (this.thunderTimer) {
            clearInterval(this.thunderTimer);
            this.thunderTimer = null;
        }
        if (this.lightningTimer) {
            clearInterval(this.lightningTimer);
            this.lightningTimer = null;
        }
    }

    flashEffect(type) {
        const body = document.body;
        const flashClass = type === 'thunder' ? 'thunder-flash' : 'lightning-flash';
        
        body.classList.add(flashClass);
        setTimeout(() => {
            body.classList.remove(flashClass);
        }, type === 'thunder' ? 300 : 150);
    }

    setupVisualizer() {
        this.canvas = document.getElementById('audio-visualizer');
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 100;
    }

    startVisualization() {
        const draw = () => {
            if (!this.isPlaying) return;
            
            const frequencyData = this.audioEngine.getFrequencyData();
            if (!frequencyData) {
                this.animationId = requestAnimationFrame(draw);
                return;
            }
            
            this.canvasCtx.fillStyle = 'rgba(10, 15, 25, 0.2)';
            this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            const barWidth = this.canvas.width / frequencyData.length * 2;
            let x = 0;
            
            for (let i = 0; i < frequencyData.length; i++) {
                const barHeight = (frequencyData[i] / 255) * this.canvas.height * 0.8;
                
                const hue = (i / frequencyData.length) * 60 + 180;
                this.canvasCtx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
                
                this.canvasCtx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
            
            this.animationId = requestAnimationFrame(draw);
        };
        
        draw();
    }

    stopVisualization() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.canvasCtx) {
            this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StormApp();
});