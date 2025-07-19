# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based storm sounds application that generates atmospheric audio experiences using the Web Audio API. The app allows users to control four different storm elements (wind, rain, thunder, lightning) through interactive dial controls and provides real-time audio visualization.

## Architecture

### Core Components

- **StormApp (app.js)**: Main application controller that manages UI interactions, dial controls, and coordinates with the audio engine
- **StormAudioEngine (audio-engine.js)**: Original procedural audio synthesis engine using only Web Audio API oscillators and noise generation
- **StormAudioEngine (audio-engine-samples.js)**: Enhanced audio engine that supports realistic audio samples with fallback to synthesis
- **index.html**: Single-page application with interactive dial controls for each storm element
- **styles.css**: Complete styling with CSS animations, custom dial controls, and responsive design
- **server.js**: Simple HTTP server for local development with CORS support for audio file loading

### Key Patterns

**Dual Audio Architecture**: The app supports two modes:
- **Synthesis Mode (audio-engine.js)**: Procedural sound generation using oscillators and white noise - works immediately without audio files
- **Sample Mode (audio-engine-samples.js)**: Uses real audio files with enhanced debugging and fallback to synthesis if files fail to load

**UI Pattern**: Custom circular dial controls:
- Mouse/touch drag interaction with angle-based input calculating position from center
- Real-time visual feedback using CSS custom properties (`--intensity`)
- Coordinated audio parameter updates through `setSoundLevel()` method

**State Management**: Centralized in StormApp class:
- Tracks dial positions and audio levels in `this.dials` object
- Manages play/pause state with `this.isPlaying` boolean
- Handles random thunder/lightning triggering with separate timers

**Audio Context Handling**: Properly manages Web Audio API lifecycle:
- Handles AudioContext suspension/resume for browser autoplay policies
- User interaction required to start due to browser restrictions
- Automatic context resumption in `start()` method

## Development Notes

**No Build Process**: This is a static web application with no build tools, package manager, or dependencies. Open `index.html` directly in a browser to run.

**Testing**: Manual testing only - no automated test framework configured.

**Local Development**: Use `node server.js` for enhanced audio file loading and debugging. Server runs on port 3000 with CORS headers enabled.

**Audio File Support**: 
- Place audio files in `sounds/` directory
- Supported formats: MP3, WAV
- Files are configured in `audioFiles` object in `audio-engine-samples.js`
- App includes comprehensive audio loading debugging with detailed console logs

**Browser Support**: Uses modern Web Audio API features - requires recent browser versions with Web Audio API support.

## File Structure

```
/
├── index.html                    # Main HTML with dial UI components
├── app.js                       # UI controller and interaction logic  
├── audio-engine.js              # Original synthesis-only engine
├── audio-engine-samples.js      # Enhanced engine with audio file support
├── server.js                    # Development server for local testing
├── debug.html                   # Audio debugging interface
├── download-sounds.html         # Audio download guide
├── styles.css                   # Complete styling and animations
└── sounds/                      # Audio sample files directory
    ├── wind-loop.mp3           # Looping wind sounds
    ├── rain-loop.mp3           # Looping rain sounds
    ├── thunder-[1-3].mp3       # Thunder variations
    ├── thunder-[1-3].wav       # Thunder variations (WAV)
    └── lightning-[1-2].mp3     # Lightning variations
```

## Audio Engine Architecture

**Synthesis Engine (audio-engine.js)**:
- Wind: Sawtooth oscillator + white noise with lowpass filtering
- Rain: White noise with bandpass and highpass filtering  
- Thunder: Low-frequency sawtooth with ADSR envelope
- Lightning: High-frequency filtered white noise bursts

**Sample Engine (audio-engine-samples.js)**:
- Looping sounds: BufferSource nodes with automatic restart on intensity changes
- Random sounds: Multiple variations selected randomly for natural feel
- Fallback synthesis: Uses original synthesis methods if audio files fail to load
- Enhanced debugging: Detailed console logging for audio loading and playback

## Important Implementation Details

**Audio Loading**: Sample engine includes comprehensive error handling and logging for debugging audio file issues. Check browser console for detailed audio loading information.

**Dial Interaction**: Custom drag interaction calculates angle from center point, constrains to 270-degree range, and converts to 0-1 intensity values.

**Random Event Timing**: Thunder and lightning use separate intervals (2000ms and 1500ms) with probability calculations based on dial intensity.

**Visual Effects**: Screen flash effects synchronized with audio triggers using CSS classes (`thunder-flash`, `lightning-flash`).

**Audio Visualization**: Real-time frequency analysis using AnalyserNode with canvas-based spectrum display.