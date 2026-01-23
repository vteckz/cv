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

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = null;
    this.particleCount = 500;
    this.positions = null;
    this.velocities = [];
    this.colors = null;
  }

  init() {
    const geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.particleCount * 3);
    this.colors = new Float32Array(this.particleCount * 3);

    const color1 = new THREE.Color(0xa3e635); // Brand green
    const color2 = new THREE.Color(0x4a90d9); // Blue accent
    const color3 = new THREE.Color(0xffffff); // White

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Random position in a large sphere
      const radius = 15 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      this.positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      this.positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 5;
      this.positions[i3 + 2] = radius * Math.cos(phi) - 10;

      // Random velocity
      this.velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      });

      // Random color from palette
      const colorChoice = Math.random();
      let color;
      if (colorChoice < 0.5) {
        color = color1;
      } else if (colorChoice < 0.8) {
        color = color2;
      } else {
        color = color3;
      }

      this.colors[i3] = color.r;
      this.colors[i3 + 1] = color.g;
      this.colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  update(time) {
    if (!this.particles) return;

    const positions = this.particles.geometry.attributes.position.array;

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Gentle floating motion
      positions[i3] += this.velocities[i].x + Math.sin(time + i) * 0.001;
      positions[i3 + 1] += this.velocities[i].y + Math.cos(time + i * 0.5) * 0.001;
      positions[i3 + 2] += this.velocities[i].z;

      // Wrap around if too far
      const distance = Math.sqrt(
        positions[i3] ** 2 +
        (positions[i3 + 1] + 5) ** 2 +
        (positions[i3 + 2] + 10) ** 2
      );

      if (distance > 35) {
        const radius = 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 5;
        positions[i3 + 2] = radius * Math.cos(phi) - 10;
      }
    }

    this.particles.geometry.attributes.position.needsUpdate = true;

    // Slow rotation
    this.particles.rotation.y = time * 0.02;
  }

  burst(position, color = 0xa3e635) {
    // Create a burst of particles at a position
    const burstCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(burstCount * 3);
    const velocities = [];

    for (let i = 0; i < burstCount; i++) {
      const i3 = i * 3;
      positions[i3] = position.x;
      positions[i3 + 1] = position.y;
      positions[i3 + 2] = position.z;

      velocities.push({
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.3
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      color: color,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    });

    const burst = new THREE.Points(geometry, material);
    this.scene.add(burst);

    // Animate burst
    const startTime = performance.now();
    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      if (elapsed > 2) {
        this.scene.remove(burst);
        geometry.dispose();
        material.dispose();
        return;
      }

      const pos = burst.geometry.attributes.position.array;
      for (let i = 0; i < burstCount; i++) {
        const i3 = i * 3;
        pos[i3] += velocities[i].x * (1 - elapsed / 2);
        pos[i3 + 1] += velocities[i].y * (1 - elapsed / 2);
        pos[i3 + 2] += velocities[i].z * (1 - elapsed / 2);
      }

      burst.geometry.attributes.position.needsUpdate = true;
      material.opacity = 1 - elapsed / 2;

      requestAnimationFrame(animate);
    };

    animate();
  }
}

export default ParticleSystem;
