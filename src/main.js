import * as THREE from 'three';
import { gsap } from 'gsap';
import { cvData } from './data/cv-data.js';
import { BoxScene } from './scenes/BoxScene.js';
import { AvatarScene } from './scenes/AvatarScene.js';
import { ProfileScene } from './scenes/ProfileScene.js';
import { SpeechEngine } from './components/SpeechEngine.js';
import { ParticleSystem } from './effects/ParticleSystem.js';
import { createLighting } from './effects/Lighting.js';

class App {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.loadingScreen = document.getElementById('loading-screen');
    this.progressBar = document.getElementById('progress-bar');
    this.startBtn = document.getElementById('start-btn');
    this.muteBtn = document.getElementById('mute-btn');
    this.skipBtn = document.getElementById('skip-btn');
    this.infoPanel = document.getElementById('info-panel');
    this.speechBubble = document.getElementById('speech-bubble');
    this.navContainer = document.getElementById('nav-container');

    this.currentSection = 0;
    this.isPlaying = false;
    this.isMuted = false;
    this.isLoaded = false;

    this.init();
  }

  async init() {
    // Setup Three.js
    this.setupRenderer();
    this.setupScene();
    this.setupCamera();

    // Create components
    this.speechEngine = new SpeechEngine();
    this.particles = new ParticleSystem(this.scene);
    createLighting(this.scene);

    // Create scenes
    this.boxScene = new BoxScene(this.scene);
    this.avatarScene = new AvatarScene(this.scene);
    this.profileScene = new ProfileScene(this.scene);

    // Load assets
    await this.loadAssets();

    // Setup event listeners
    this.setupEventListeners();

    // Start render loop
    this.animate();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f);
    this.scene.fog = new THREE.Fog(0x0a0a0f, 10, 50);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 8);
    this.camera.lookAt(0, 0, 0);
  }

  async loadAssets() {
    const totalSteps = 5;
    let currentStep = 0;

    const updateProgress = () => {
      currentStep++;
      const progress = (currentStep / totalSteps) * 100;
      this.progressBar.style.width = `${progress}%`;
    };

    // Initialize box scene
    await this.boxScene.init();
    updateProgress();

    // Initialize avatar
    await this.avatarScene.init();
    updateProgress();

    // Initialize profile sections
    await this.profileScene.init(cvData);
    updateProgress();

    // Initialize particles
    this.particles.init();
    updateProgress();

    // Initialize speech engine
    await this.speechEngine.init();
    updateProgress();

    // Loading complete
    this.isLoaded = true;
    await this.showStartButton();
  }

  async showStartButton() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.loadingScreen.classList.add('hidden');
    this.startBtn.classList.add('visible');
  }

  setupEventListeners() {
    // Start button
    this.startBtn.addEventListener('click', () => this.startExperience());

    // Mute button
    this.muteBtn.addEventListener('click', () => this.toggleMute());

    // Skip button
    this.skipBtn.addEventListener('click', () => this.skipToNext());

    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const section = parseInt(e.target.dataset.section);
        this.goToSection(section);
      });
    });

    // Window resize
    window.addEventListener('resize', () => this.onResize());

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') this.skipToNext();
      if (e.key === 'ArrowLeft') this.goToSection(Math.max(0, this.currentSection - 1));
      if (e.key === 'm') this.toggleMute();
    });
  }

  async startExperience() {
    this.startBtn.style.display = 'none';
    this.isPlaying = true;

    // Start box unpack animation
    await this.boxScene.playUnpackAnimation(this.camera);

    // Show avatar
    await this.avatarScene.show();

    // Show navigation
    this.navContainer.style.display = 'flex';

    // Start the journey through sections
    this.playSection(0);
  }

  async playSection(index) {
    this.currentSection = index;
    this.updateNavigation();

    const sections = ['welcome', 'about', 'experience', 'skills', 'education', 'contact'];
    const sectionName = sections[index];

    // Update info panel
    this.updateInfoPanel(sectionName);

    // Move camera and show relevant 3D content
    await this.profileScene.showSection(sectionName, this.camera);

    // Play avatar animation
    this.avatarScene.playGesture(sectionName);

    // Speak the content
    if (!this.isMuted) {
      const speech = cvData.speeches[sectionName];
      this.showSpeechBubble(speech);
      await this.speechEngine.speak(speech);
      this.hideSpeechBubble();
    }

    // Auto-advance after delay (if not last section)
    if (index < sections.length - 1 && this.isPlaying) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (this.isPlaying && this.currentSection === index) {
        this.playSection(index + 1);
      }
    }
  }

  updateInfoPanel(sectionName) {
    const panel = this.infoPanel;
    const title = document.getElementById('panel-title');
    const subtitle = document.getElementById('panel-subtitle');
    const content = document.getElementById('panel-content');

    const panelData = {
      welcome: {
        title: cvData.personal.name,
        subtitle: cvData.personal.title,
        content: `${cvData.personal.location} | ${cvData.personal.email}`
      },
      about: {
        title: 'About Me',
        subtitle: '17+ Years of Experience',
        content: cvData.shortSummary
      },
      experience: {
        title: 'Experience',
        subtitle: `${cvData.experience.length} Key Roles`,
        content: cvData.experience.map(e => `${e.title} at ${e.company}`).join('\n')
      },
      skills: {
        title: 'Technical Skills',
        subtitle: 'Full Stack Expertise',
        content: Object.values(cvData.skills).flat().slice(0, 12).join(' • ')
      },
      education: {
        title: 'Education',
        subtitle: cvData.education[0].degree,
        content: `${cvData.education[0].institution}\n${cvData.certifications.length} Professional Certifications`
      },
      contact: {
        title: "Let's Connect",
        subtitle: cvData.personal.noticePeriod,
        content: `Email: ${cvData.personal.email}\nPhone: ${cvData.personal.phone}`
      }
    };

    const data = panelData[sectionName];
    title.textContent = data.title;
    subtitle.textContent = data.subtitle;
    content.textContent = data.content;

    panel.classList.add('visible');
  }

  showSpeechBubble(text) {
    const bubble = this.speechBubble;
    const speechText = document.getElementById('speech-text');
    speechText.textContent = text;
    bubble.classList.add('visible');
  }

  hideSpeechBubble() {
    this.speechBubble.classList.remove('visible');
  }

  updateNavigation() {
    document.querySelectorAll('.nav-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === this.currentSection);
    });
  }

  goToSection(index) {
    this.isPlaying = false;
    this.speechEngine.stop();
    this.hideSpeechBubble();
    this.playSection(index);
  }

  skipToNext() {
    this.speechEngine.stop();
    this.hideSpeechBubble();
    if (this.currentSection < 5) {
      this.playSection(this.currentSection + 1);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.muteBtn.innerHTML = this.isMuted
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
           <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
           <line x1="23" y1="9" x2="17" y2="15"></line>
           <line x1="17" y1="9" x2="23" y2="15"></line>
         </svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
           <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
           <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
         </svg>`;

    if (this.isMuted) {
      this.speechEngine.stop();
    }
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = performance.now() * 0.001;

    // Update components
    if (this.boxScene) this.boxScene.update(time);
    if (this.avatarScene) this.avatarScene.update(time);
    if (this.profileScene) this.profileScene.update(time);
    if (this.particles) this.particles.update(time);

    // Render
    this.renderer.render(this.scene, this.camera);
  }
}

// Start the application
new App();
