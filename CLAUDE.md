# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based storm sounds application that generates atmospheric audio experiences using the Web Audio API. The app allows users to control four different storm elements (wind, rain, thunder, lightning) through interactive dial controls and provides real-time audio visualization.

## Architecture

### Core Components

- **StormApp (app.js)**: Main application controller that manages UI interactions, dial controls, and coordinates with the audio engine
- **StormAudioEngine (audio-engine.js)**: Audio processing engine that handles Web Audio API operations, sound synthesis, and effects
- **index.html**: Single-page application with interactive dial controls for each storm element
- **styles.css**: Complete styling with CSS animations, custom dial controls, and responsive design

### Key Patterns

**Audio Architecture**: Uses Web Audio API with:
- Procedural sound generation (no audio files)
- Real-time audio synthesis for wind/rain using oscillators and noise
- Dynamic filter chains for realistic storm effects
- Audio analysis for visualization

**UI Pattern**: Custom circular dial controls:
- Mouse/touch drag interaction with angle-based input
- Real-time visual feedback with CSS custom properties
- Coordinated audio parameter updates

**State Management**: Centralized in StormApp class:
- Tracks dial positions and audio levels
- Manages play/pause state across all components
- Handles random thunder/lightning triggering

## Development Notes

**No Build Process**: This is a static web application with no build tools, package manager, or dependencies. Open `index.html` directly in a browser to run.

**Testing**: Manual testing only - no automated test framework configured.

**Audio Context**: Requires user interaction to start due to browser autoplay policies. The app handles AudioContext suspension/resume automatically.

**Browser Support**: Uses modern Web Audio API features - requires recent browser versions.

## File Structure

```
/
├── index.html          # Main HTML with dial UI components
├── app.js             # UI controller and interaction logic  
├── audio-engine.js    # Web Audio API sound synthesis
└── styles.css         # Complete styling and animations
```