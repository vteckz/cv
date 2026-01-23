/**
 * Linton Evans - 3D Interactive CV Portfolio
 * Copyright (c) 2025 Linton Evans. All rights reserved.
 *
 * This source code is proprietary and confidential.
 * Unauthorized copying, modification, distribution, or use of this code,
 * via any medium, is strictly prohibited without express written permission.
 *
 * Contact: linton.evans@outlook.com
 */

import * as THREE from 'three';
import { gsap } from 'gsap';

export class ProfileScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.sections = {};
    this.currentSection = null;
    this.cvData = null;
  }

  async init(cvData) {
    this.cvData = cvData;
    this.createSections();
    this.scene.add(this.group);
  }

  createSections() {
    this.createWelcomeSection();
    this.createAboutSection();
    this.createExperienceSection();
    this.createSkillsSection();
    this.createEducationSection();
    this.createContactSection();

    // Hide all initially
    Object.values(this.sections).forEach(section => {
      section.visible = false;
    });
  }

  createTextSprite(text, options = {}) {
    const {
      fontSize = 48,
      fontWeight = '600',
      color = '#ffffff',
      backgroundColor = 'transparent',
      maxWidth = 800
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1024;
    canvas.height = 256;

    ctx.fillStyle = backgroundColor;
    if (backgroundColor !== 'transparent') {
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.font = `${fontWeight} ${fontSize}px 'Space Grotesk', 'Inter', sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Word wrap
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine.trim());

    const lineHeight = fontSize * 1.2;
    const startY = (canvas.height - lines.length * lineHeight) / 2 + lineHeight / 2;

    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(4, 1, 1);

    return sprite;
  }

  createCard(title, subtitle, content, color = 0x1a1a2e) {
    const group = new THREE.Group();

    // Card background
    const cardGeo = new THREE.PlaneGeometry(3, 2);
    const cardMat = new THREE.MeshStandardMaterial({
      color: color,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    const card = new THREE.Mesh(cardGeo, cardMat);
    group.add(card);

    // Border
    const borderGeo = new THREE.EdgesGeometry(cardGeo);
    const borderMat = new THREE.LineBasicMaterial({ color: 0xa3e635 });
    const border = new THREE.LineSegments(borderGeo, borderMat);
    border.position.z = 0.01;
    group.add(border);

    // Title sprite
    const titleSprite = this.createTextSprite(title, {
      fontSize: 42,
      fontWeight: '700',
      color: '#a3e635'
    });
    titleSprite.position.set(0, 0.6, 0.1);
    titleSprite.scale.set(2.5, 0.6, 1);
    group.add(titleSprite);

    // Subtitle sprite
    if (subtitle) {
      const subSprite = this.createTextSprite(subtitle, {
        fontSize: 28,
        fontWeight: '400',
        color: '#cccccc'
      });
      subSprite.position.set(0, 0.2, 0.1);
      subSprite.scale.set(2.5, 0.5, 1);
      group.add(subSprite);
    }

    // Content sprite
    if (content) {
      const contentSprite = this.createTextSprite(content, {
        fontSize: 24,
        fontWeight: '400',
        color: '#ffffff',
        maxWidth: 700
      });
      contentSprite.position.set(0, -0.3, 0.1);
      contentSprite.scale.set(2.8, 0.6, 1);
      group.add(contentSprite);
    }

    return group;
  }

  createWelcomeSection() {
    const section = new THREE.Group();

    // Name as 3D floating text effect
    const nameSprite = this.createTextSprite(this.cvData.personal.name, {
      fontSize: 72,
      fontWeight: '700',
      color: '#a3e635'
    });
    nameSprite.position.set(-2, 2.5, -3);
    nameSprite.scale.set(5, 1.2, 1);
    section.add(nameSprite);

    // Title
    const titleSprite = this.createTextSprite(this.cvData.personal.title, {
      fontSize: 48,
      fontWeight: '500',
      color: '#ffffff'
    });
    titleSprite.position.set(-2, 1.8, -3);
    titleSprite.scale.set(4, 0.8, 1);
    section.add(titleSprite);

    // Location
    const locSprite = this.createTextSprite(this.cvData.personal.location, {
      fontSize: 32,
      fontWeight: '400',
      color: '#888888'
    });
    locSprite.position.set(-2, 1.2, -3);
    locSprite.scale.set(3, 0.6, 1);
    section.add(locSprite);

    // Decorative elements
    const ringGeo = new THREE.TorusGeometry(1.5, 0.02, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xa3e635,
      transparent: true,
      opacity: 0.3
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(-2, 2, -4);
    ring.rotation.x = Math.PI / 2;
    section.add(ring);

    this.sections.welcome = section;
    this.group.add(section);
  }

  createAboutSection() {
    const section = new THREE.Group();

    const card = this.createCard(
      'About Me',
      '17+ Years of Experience',
      'Bridging technical expertise with business execution'
    );
    card.position.set(-3, 1.5, -2);
    card.rotation.y = 0.3;
    section.add(card);

    // Key highlights as floating badges
    const highlights = ['E-Commerce', 'UC Systems', 'Cloud', 'Leadership'];
    highlights.forEach((text, i) => {
      const badge = this.createBadge(text);
      badge.position.set(-4 + i * 1.5, 0.5, -1);
      badge.rotation.y = -0.1 + i * 0.05;
      section.add(badge);
    });

    this.sections.about = section;
    this.group.add(section);
  }

  createBadge(text) {
    const group = new THREE.Group();

    const geo = new THREE.BoxGeometry(1.2, 0.4, 0.1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.3,
      roughness: 0.7
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    // Border glow
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xa3e635 })
    );
    group.add(line);

    const sprite = this.createTextSprite(text, {
      fontSize: 28,
      color: '#a3e635'
    });
    sprite.position.z = 0.1;
    sprite.scale.set(1, 0.3, 1);
    group.add(sprite);

    return group;
  }

  createExperienceSection() {
    const section = new THREE.Group();

    // Timeline line
    const lineGeo = new THREE.BoxGeometry(0.05, 6, 0.05);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xa3e635 });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(-4, 1, -3);
    section.add(line);

    // Experience cards along timeline
    this.cvData.experience.forEach((exp, i) => {
      const card = this.createCard(
        exp.title,
        exp.company,
        exp.period
      );
      card.position.set(-2, 3 - i * 1.8, -3 + i * 0.5);
      card.rotation.y = 0.2;
      card.scale.set(0.8, 0.8, 0.8);
      section.add(card);

      // Timeline dot
      const dotGeo = new THREE.SphereGeometry(0.1, 16, 16);
      const dotMat = new THREE.MeshStandardMaterial({
        color: 0xa3e635,
        emissive: 0xa3e635,
        emissiveIntensity: 0.5
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(-4, 3 - i * 1.8, -3);
      section.add(dot);
    });

    this.sections.experience = section;
    this.group.add(section);
  }

  createSkillsSection() {
    const section = new THREE.Group();

    // Skills orbiting around center
    const allSkills = [
      ...this.cvData.skills.technical.slice(0, 6),
      ...this.cvData.skills.platforms.slice(0, 4),
      ...this.cvData.skills.marketing.slice(0, 4)
    ];

    const orbitRadius = 3;
    const orbitGroup = new THREE.Group();

    allSkills.forEach((skill, i) => {
      const angle = (i / allSkills.length) * Math.PI * 2;
      const badge = this.createBadge(skill);
      badge.position.set(
        Math.cos(angle) * orbitRadius,
        Math.sin(angle) * 0.5 + 1.5,
        Math.sin(angle) * orbitRadius - 5
      );
      badge.lookAt(0, 1.5, -5);
      orbitGroup.add(badge);
    });

    section.add(orbitGroup);
    this.skillsOrbit = orbitGroup;

    // Center title
    const title = this.createTextSprite('Technical Skills', {
      fontSize: 48,
      fontWeight: '700',
      color: '#a3e635'
    });
    title.position.set(0, 3, -5);
    title.scale.set(4, 0.8, 1);
    section.add(title);

    this.sections.skills = section;
    this.group.add(section);
  }

  createEducationSection() {
    const section = new THREE.Group();

    // Degree card
    const degreeCard = this.createCard(
      this.cvData.education[0].degree,
      this.cvData.education[0].institution,
      this.cvData.education[0].period
    );
    degreeCard.position.set(-2.5, 2, -3);
    degreeCard.rotation.y = 0.2;
    section.add(degreeCard);

    // Certifications floating around
    const certPositions = [
      { x: 1, y: 2.5, z: -4 },
      { x: 2.5, y: 1.5, z: -3.5 },
      { x: 1.5, y: 0.5, z: -3 },
      { x: -1, y: 0.8, z: -2 }
    ];

    this.cvData.certifications.slice(0, 4).forEach((cert, i) => {
      const badge = this.createBadge(cert.name.split(' ').slice(0, 3).join(' '));
      const pos = certPositions[i];
      badge.position.set(pos.x, pos.y, pos.z);
      badge.rotation.y = -0.1 + Math.random() * 0.2;
      section.add(badge);
    });

    // Title
    const title = this.createTextSprite('Education & Certifications', {
      fontSize: 42,
      fontWeight: '700',
      color: '#a3e635'
    });
    title.position.set(0, 3.5, -4);
    title.scale.set(5, 0.8, 1);
    section.add(title);

    this.sections.education = section;
    this.group.add(section);
  }

  createContactSection() {
    const section = new THREE.Group();

    // Main CTA card
    const card = this.createCard(
      "Let's Connect",
      this.cvData.personal.noticePeriod,
      ''
    );
    card.position.set(-2, 2, -3);
    card.rotation.y = 0.15;
    section.add(card);

    // Contact details as badges
    const contactInfo = [
      { icon: 'Email', text: this.cvData.personal.email },
      { icon: 'Phone', text: this.cvData.personal.phone },
      { icon: 'Location', text: this.cvData.personal.location }
    ];

    contactInfo.forEach((info, i) => {
      const badge = this.createBadge(info.text);
      badge.position.set(-3 + i * 2.5, 0.5, -2);
      badge.scale.set(1.3, 1, 1);
      section.add(badge);
    });

    // Decorative rings
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(1 + i * 0.5, 0.01, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xa3e635,
        transparent: true,
        opacity: 0.2 - i * 0.05
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(2, 1.5, -5);
      ring.rotation.x = Math.PI / 3;
      ring.rotation.y = i * 0.2;
      section.add(ring);
    }

    this.sections.contact = section;
    this.group.add(section);
  }

  async showSection(sectionName, camera) {
    // Hide current section
    if (this.currentSection) {
      await this.hideSection(this.currentSection);
    }

    // Show new section
    const section = this.sections[sectionName];
    if (!section) return;

    section.visible = true;
    this.currentSection = sectionName;

    // Animate section in
    section.children.forEach((child, i) => {
      child.material && (child.material.opacity = 0);
      gsap.to(child.position, {
        y: child.position.y,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power2.out'
      });
      if (child.material) {
        gsap.to(child.material, {
          opacity: child.material.opacity || 1,
          duration: 0.4,
          delay: i * 0.1
        });
      }
    });

    // Camera movement based on section
    const cameraPositions = {
      welcome: { x: 0, y: 1.5, z: 5 },
      about: { x: -1, y: 1.5, z: 4 },
      experience: { x: 0, y: 1.5, z: 3 },
      skills: { x: 1, y: 2, z: 4 },
      education: { x: 0, y: 1.8, z: 4 },
      contact: { x: 0, y: 1.5, z: 4 }
    };

    const pos = cameraPositions[sectionName];
    if (pos) {
      gsap.to(camera.position, {
        ...pos,
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }
  }

  async hideSection(sectionName) {
    const section = this.sections[sectionName];
    if (!section) return;

    return new Promise(resolve => {
      gsap.to(section.children.map(c => c.position), {
        y: '-=0.5',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          section.visible = false;
          resolve();
        }
      });
    });
  }

  update(time) {
    // Rotate skills orbit
    if (this.skillsOrbit && this.currentSection === 'skills') {
      this.skillsOrbit.rotation.y = time * 0.1;
    }

    // Animate floating elements
    Object.values(this.sections).forEach(section => {
      if (section.visible) {
        section.children.forEach((child, i) => {
          if (child.isSprite || child.type === 'Group') {
            child.position.y += Math.sin(time * 2 + i) * 0.0005;
          }
        });
      }
    });
  }
}
