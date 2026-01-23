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

export class BoxScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.parts = {};
    this.isUnpacked = false;
  }

  async init() {
    this.createBox();
    this.createRibbon();
    this.createGlow();
    this.scene.add(this.group);
    this.group.position.set(0, 0, 0);
  }

  createBox() {
    // Brand colors
    const primaryColor = 0xa3e635; // Lime green from CV
    const darkColor = 0x1a1a2e;

    // Box material with metallic finish
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: darkColor,
      metalness: 0.3,
      roughness: 0.4,
      envMapIntensity: 0.5
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: primaryColor,
      metalness: 0.5,
      roughness: 0.3,
      emissive: primaryColor,
      emissiveIntensity: 0.2
    });

    // Box dimensions
    const size = 2;
    const thickness = 0.08;

    // Bottom
    const bottomGeo = new THREE.BoxGeometry(size, thickness, size);
    const bottom = new THREE.Mesh(bottomGeo, boxMaterial);
    bottom.position.y = -size / 2;
    bottom.receiveShadow = true;
    this.parts.bottom = bottom;

    // Front panel
    const panelGeo = new THREE.BoxGeometry(size, size, thickness);
    const front = new THREE.Mesh(panelGeo, boxMaterial);
    front.position.set(0, 0, size / 2);
    front.castShadow = true;
    this.parts.front = front;

    // Back panel
    const back = new THREE.Mesh(panelGeo, boxMaterial);
    back.position.set(0, 0, -size / 2);
    back.castShadow = true;
    this.parts.back = back;

    // Left panel
    const sideGeo = new THREE.BoxGeometry(thickness, size, size);
    const left = new THREE.Mesh(sideGeo, boxMaterial);
    left.position.set(-size / 2, 0, 0);
    left.castShadow = true;
    this.parts.left = left;

    // Right panel
    const right = new THREE.Mesh(sideGeo, boxMaterial);
    right.position.set(size / 2, 0, 0);
    right.castShadow = true;
    this.parts.right = right;

    // Lid
    const lidGeo = new THREE.BoxGeometry(size + 0.1, thickness, size + 0.1);
    const lid = new THREE.Mesh(lidGeo, boxMaterial);
    lid.position.y = size / 2;
    lid.castShadow = true;
    this.parts.lid = lid;

    // Lid accent strip
    const stripGeo = new THREE.BoxGeometry(size + 0.12, thickness / 2, 0.15);
    const lidStrip = new THREE.Mesh(stripGeo, accentMaterial);
    lidStrip.position.y = size / 2 + thickness / 2;
    this.parts.lidStrip = lidStrip;

    // Edge accents
    const edgeGeo = new THREE.BoxGeometry(0.05, size + 0.1, 0.05);
    const edges = [];
    const edgePositions = [
      [size / 2, 0, size / 2],
      [-size / 2, 0, size / 2],
      [size / 2, 0, -size / 2],
      [-size / 2, 0, -size / 2]
    ];

    edgePositions.forEach(pos => {
      const edge = new THREE.Mesh(edgeGeo, accentMaterial);
      edge.position.set(...pos);
      edges.push(edge);
      this.group.add(edge);
    });
    this.parts.edges = edges;

    // Add all parts to group
    Object.values(this.parts).forEach(part => {
      if (part instanceof THREE.Mesh) {
        this.group.add(part);
      }
    });

    // Initial floating animation
    this.group.rotation.y = Math.PI * 0.1;
  }

  createRibbon() {
    const ribbonMaterial = new THREE.MeshStandardMaterial({
      color: 0xa3e635,
      metalness: 0.4,
      roughness: 0.3,
      emissive: 0xa3e635,
      emissiveIntensity: 0.3,
      side: THREE.DoubleSide
    });

    // Vertical ribbon
    const ribbonV = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 2.2, 0.02),
      ribbonMaterial
    );
    ribbonV.position.set(0, 0, 1.01);
    this.parts.ribbonV = ribbonV;

    // Horizontal ribbon
    const ribbonH = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.2, 0.02),
      ribbonMaterial
    );
    ribbonH.position.set(0, 0, 1.01);
    this.parts.ribbonH = ribbonH;

    // Bow (simplified as spheres)
    const bowGroup = new THREE.Group();
    const bowMaterial = ribbonMaterial.clone();

    const loop1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.06, 8, 16, Math.PI),
      bowMaterial
    );
    loop1.rotation.z = Math.PI / 4;
    loop1.position.set(-0.15, 0.1, 0);

    const loop2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.06, 8, 16, Math.PI),
      bowMaterial
    );
    loop2.rotation.z = -Math.PI / 4;
    loop2.position.set(0.15, 0.1, 0);

    const center = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      bowMaterial
    );

    bowGroup.add(loop1, loop2, center);
    bowGroup.position.set(0, 1.1, 1.05);
    this.parts.bow = bowGroup;

    this.group.add(ribbonV, ribbonH, bowGroup);
  }

  createGlow() {
    // Inner glow light
    const glowLight = new THREE.PointLight(0xa3e635, 0, 5);
    glowLight.position.set(0, 0, 0);
    this.parts.glowLight = glowLight;
    this.group.add(glowLight);

    // Glow sphere (hidden initially)
    const glowGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xa3e635,
      transparent: true,
      opacity: 0
    });
    const glowSphere = new THREE.Mesh(glowGeo, glowMat);
    this.parts.glowSphere = glowSphere;
    this.group.add(glowSphere);
  }

  async playUnpackAnimation(camera) {
    return new Promise(resolve => {
      const tl = gsap.timeline({
        onComplete: () => {
          this.isUnpacked = true;
          resolve();
        }
      });

      // Initial dramatic pause with glow buildup
      tl.to(this.parts.glowLight, {
        intensity: 2,
        duration: 1,
        ease: 'power2.in'
      });

      tl.to(this.parts.glowSphere.material, {
        opacity: 0.5,
        duration: 0.5
      }, '-=0.5');

      // Camera pulls back slightly
      tl.to(camera.position, {
        z: 10,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.5');

      // Lid lifts up
      tl.to(this.parts.lid.position, {
        y: 3,
        duration: 0.8,
        ease: 'power2.out'
      });

      tl.to(this.parts.lidStrip.position, {
        y: 3,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.8');

      // Bow flies up
      tl.to(this.parts.bow.position, {
        y: 4,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.8');

      tl.to(this.parts.bow.rotation, {
        z: Math.PI * 2,
        duration: 1
      }, '-=0.8');

      // Lid rotates and fades
      tl.to(this.parts.lid.rotation, {
        x: -Math.PI / 2,
        duration: 0.5
      }, '-=0.3');

      tl.to([this.parts.lid, this.parts.lidStrip, this.parts.bow], {
        visible: false,
        duration: 0.01
      });

      // Light burst
      tl.to(this.parts.glowLight, {
        intensity: 8,
        duration: 0.3,
        ease: 'power2.in'
      });

      tl.to(this.parts.glowSphere.material, {
        opacity: 1,
        duration: 0.3
      }, '-=0.3');

      tl.to(this.parts.glowSphere.scale, {
        x: 3,
        y: 3,
        z: 3,
        duration: 0.5,
        ease: 'power2.out'
      });

      // Sides unfold outward
      const unfoldDuration = 0.6;
      const unfoldDelay = '-=0.3';

      // Front falls forward
      tl.to(this.parts.front.rotation, {
        x: -Math.PI / 2,
        duration: unfoldDuration,
        ease: 'power2.out'
      }, unfoldDelay);

      tl.to(this.parts.front.position, {
        y: -1,
        z: 2,
        duration: unfoldDuration
      }, unfoldDelay);

      // Back falls backward
      tl.to(this.parts.back.rotation, {
        x: Math.PI / 2,
        duration: unfoldDuration,
        ease: 'power2.out'
      }, unfoldDelay);

      tl.to(this.parts.back.position, {
        y: -1,
        z: -2,
        duration: unfoldDuration
      }, unfoldDelay);

      // Left falls left
      tl.to(this.parts.left.rotation, {
        z: Math.PI / 2,
        duration: unfoldDuration,
        ease: 'power2.out'
      }, unfoldDelay);

      tl.to(this.parts.left.position, {
        x: -2,
        y: -1,
        duration: unfoldDuration
      }, unfoldDelay);

      // Right falls right
      tl.to(this.parts.right.rotation, {
        z: -Math.PI / 2,
        duration: unfoldDuration,
        ease: 'power2.out'
      }, unfoldDelay);

      tl.to(this.parts.right.position, {
        x: 2,
        y: -1,
        duration: unfoldDuration
      }, unfoldDelay);

      // Ribbon fades
      tl.to([this.parts.ribbonV.material, this.parts.ribbonH.material], {
        opacity: 0,
        duration: 0.3
      }, '-=0.3');

      // Glow fades out
      tl.to(this.parts.glowLight, {
        intensity: 0,
        duration: 1
      });

      tl.to(this.parts.glowSphere.material, {
        opacity: 0,
        duration: 1
      }, '-=1');

      // Move entire box down and fade
      tl.to(this.group.position, {
        y: -5,
        duration: 1.5,
        ease: 'power2.in'
      }, '-=0.5');

      tl.to(this.group, {
        visible: false,
        duration: 0.01
      });

      // Camera moves to avatar position
      tl.to(camera.position, {
        x: 0,
        y: 1.5,
        z: 5,
        duration: 1.5,
        ease: 'power2.inOut'
      }, '-=1.5');
    });
  }

  update(time) {
    if (this.isUnpacked) return;

    // Gentle floating animation
    this.group.position.y = Math.sin(time * 0.8) * 0.1;
    this.group.rotation.y = Math.PI * 0.1 + Math.sin(time * 0.5) * 0.05;

    // Pulsing glow on ribbon
    if (this.parts.ribbonV && this.parts.ribbonV.material) {
      const pulse = (Math.sin(time * 2) + 1) * 0.15 + 0.2;
      this.parts.ribbonV.material.emissiveIntensity = pulse;
      this.parts.ribbonH.material.emissiveIntensity = pulse;
    }
  }
}
