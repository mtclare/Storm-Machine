# ⛈️ Storm Machine

> Create your perfect atmospheric storm experience with realistic sounds and interactive controls

[![Live Demo](https://img.shields.io/badge/🌩️-Live_Demo-blue?style=for-the-badge)](https://mtclare.github.io/Storm-Machine)
[![License](https://img.shields.io/badge/📄-MIT-green?style=for-the-badge)](LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/🤝-Contributions_Welcome-orange?style=for-the-badge)](CONTRIBUTING.md)

## 🌊 Overview

Storm Machine is an immersive web application that generates realistic atmospheric storm experiences using the Web Audio API. Mix and match different storm elements like wind, rain, thunder, and lightning to create your perfect ambient soundscape for relaxation, focus, or creative inspiration.

![Storm Machine Preview](https://via.placeholder.com/800x400/0a0f19/e8f4fd?text=🌩️+Storm+Machine+Interface)

## ✨ Features

### 🎛️ **Interactive Controls**
- **Custom Dial Interface** - Intuitive circular controls for each storm element
- **Real-time Mixing** - Adjust intensity levels on the fly
- **Touch & Mouse Support** - Works seamlessly on desktop and mobile devices

### 🔊 **Realistic Audio**
- **High-Quality Storm Sounds** - Support for realistic audio samples
- **Procedural Generation** - Fallback synthesis for immediate playback
- **Multiple Variations** - Random thunder and lightning for natural feel
- **Spatial Audio** - Immersive stereo sound experience

### 🎨 **Visual Experience**
- **Audio Visualization** - Real-time frequency spectrum display
- **Storm Effects** - Screen flashes synchronized with thunder and lightning
- **Modern UI** - Dark theme with smooth animations
- **Responsive Design** - Perfect on any screen size

### 🌩️ **Storm Elements**
- **💨 Wind** - Howling winds with adjustable intensity
- **🌧️ Rain** - From light drizzle to heavy downpour
- **⚡ Thunder** - Deep rumbling with random timing
- **🌩️ Lightning** - Sharp crackling with visual effects

## 🚀 Quick Start

### Option 1: Instant Play (Synthesized Sounds)
```bash
# Clone the repository
git clone https://github.com/mtclare/Storm-Machine.git

# Open in browser
cd Storm-Machine
open index.html
```

### Option 2: Enhanced Experience (Realistic Sounds)
```bash
# Clone the repository
git clone https://github.com/mtclare/Storm-Machine.git
cd Storm-Machine

# Create sounds directory
mkdir sounds

# Download audio files (see download-sounds.html for links)
# Organize files as:
# sounds/
# ├── wind-loop.mp3
# ├── rain-loop.mp3
# ├── thunder-1.mp3
# ├── thunder-2.mp3
# ├── thunder-3.mp3
# ├── lightning-1.mp3
# └── lightning-2.mp3

# Open in browser
open index.html
```

## 🎵 Audio Sources

The app supports both synthesized and realistic audio:

### 🎼 Synthesized Audio (Default)
- Works immediately without additional files
- Procedurally generated using Web Audio API
- Perfect for testing and development

### 🎧 Realistic Audio (Enhanced)
- Download free storm sounds from included guide (`download-sounds.html`)
- Recommended sources:
  - **🎵 Mixkit** - Free thunder and rain sounds
  - **🎵 Freesound.org** - Creative Commons recordings
  - **🎵 BBC Sound Effects** - Professional archive
  - **🎵 Pixabay** - Royalty-free sounds

## 🎮 Usage

### Basic Controls
1. **🎛️ Adjust Dials** - Click and drag the circular controls to set intensity
2. **▶️ Start Storm** - Click the play button to begin your storm
3. **🔊 Master Volume** - Use the slider to control overall volume
4. **⌨️ Keyboard** - Press `Space` to toggle play/pause

### Creating Atmospheres
- **🌙 Gentle Rain** - Low rain (20-40%) with minimal wind
- **⛈️ Thunderstorm** - High rain (60-80%) with frequent thunder (70%+)
- **🌪️ Wild Storm** - Maximum wind and rain with lightning effects
- **🌧️ Background Ambience** - Light rain (10-30%) for focus

## 🛠️ Technical Details

### Technologies Used
- **🌐 HTML5** - Semantic structure and audio elements
- **🎨 CSS3** - Custom animations and responsive design
- **⚡ JavaScript ES6+** - Modern async/await patterns
- **🔊 Web Audio API** - Real-time audio processing and synthesis
- **📱 Progressive Web App** - Mobile-optimized experience

### Browser Support
- ✅ Chrome 66+
- ✅ Firefox 60+
- ✅ Safari 11.1+
- ✅ Edge 79+
- 📱 Mobile browsers with Web Audio API support

### Performance
- **🚀 Lightweight** - No external dependencies
- **⚡ Fast Loading** - Optimized assets and code
- **🔋 Efficient** - Smart audio buffer management
- **📱 Mobile Friendly** - Touch-optimized controls

## 📁 Project Structure

```
Storm-Machine/
├── 📄 index.html                 # Main application
├── 🎨 styles.css                 # Complete styling
├── ⚡ app.js                     # UI controller
├── 🔊 audio-engine.js            # Original synthesis engine
├── 🎵 audio-engine-samples.js    # Enhanced audio engine
├── 📥 download-sounds.html       # Audio download guide
├── 📚 CLAUDE.md                  # Development guidance
└── 📖 README.md                  # This file
```

## 🔧 Customization

### Adding New Sounds
1. Place audio files in the `sounds/` directory
2. Update file paths in `audio-engine-samples.js`
3. Modify the `audioFiles` object with your file names

### Styling Changes
- Edit CSS variables in `:root` for color scheme
- Modify animations in the `@keyframes` sections
- Adjust responsive breakpoints in media queries

### New Features
- Add new sound types in the `sounds` object
- Create additional dial controls in HTML
- Extend the audio engine with new synthesis methods

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Bug Reports
- Use the [Issues](https://github.com/mtclare/Storm-Machine/issues) tab
- Include browser version and steps to reproduce
- Provide console error messages if available

### 💡 Feature Requests
- Suggest new storm elements or effects
- Propose UI/UX improvements
- Share ideas for audio enhancements

### 🔨 Development
```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
# Test thoroughly

# Commit your changes
git commit -m "Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🎵 Audio Licensing
- Synthesized sounds: Original creation, free to use
- Downloaded sounds: Follow individual source licensing
- See `download-sounds.html` for specific attribution requirements

## 🙏 Credits

### 🎼 Inspiration
- Real storm recordings from nature
- Ambient music communities
- Web audio experimentation

### 🔊 Audio Sources
- [Mixkit](https://mixkit.co/) - Free sound effects
- [Freesound.org](https://freesound.org/) - Creative Commons audio
- [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/) - Professional library

### 🛠️ Development
- **Web Audio API** - Mozilla Developer Network documentation
- **CSS Animations** - Modern web standards
- **Responsive Design** - Mobile-first principles

---

<div align="center">

**🌩️ Enjoy your perfect storm! 🌩️**

Made with ⚡ and ❤️ by [mtclare](https://github.com/mtclare)

[⭐ Star this repo](https://github.com/mtclare/Storm-Machine/stargazers) • [🐛 Report Bug](https://github.com/mtclare/Storm-Machine/issues) • [💡 Request Feature](https://github.com/mtclare/Storm-Machine/issues)

</div>