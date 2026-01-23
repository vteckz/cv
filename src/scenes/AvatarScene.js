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

export class AvatarScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.avatar = null;
    this.mixer = null;
    this.currentGesture = 'idle';
    this.isSpeaking = false;
    this.isVisible = false;
  }

  async init() {
    this.createStylizedAvatar();
    this.group.visible = false;
    this.group.position.set(2, 0, 0);
    this.scene.add(this.group);
  }

  createStylizedAvatar() {
    // Create a professional stylized 3D avatar
    // Matching Linton's appearance: blonde/light brown hair, blue eyes, stubble, athletic build

    const avatarGroup = new THREE.Group();

    // Materials
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8beac,
      roughness: 0.6,
      metalness: 0.1
    });

    const hairMaterial = new THREE.MeshStandardMaterial({
      color: 0xb8935a, // Blonde/light brown
      roughness: 0.8,
      metalness: 0.1
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a90d9, // Blue eyes
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0x4a90d9,
      emissiveIntensity: 0.1
    });

    const shirtMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e, // Dark professional shirt
      roughness: 0.7,
      metalness: 0.1
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xa3e635, // Brand green accent
      roughness: 0.4,
      metalness: 0.3,
      emissive: 0xa3e635,
      emissiveIntensity: 0.2
    });

    // Head (slightly elongated sphere)
    const headGeo = new THREE.SphereGeometry(0.35, 32, 32);
    headGeo.scale(1, 1.15, 1);
    const head = new THREE.Mesh(headGeo, skinMaterial);
    head.position.y = 1.6;
    head.castShadow = true;
    avatarGroup.add(head);
    this.head = head;

    // Hair - stylized spiky/textured top
    const hairGroup = new THREE.Group();

    // Main hair volume
    const mainHairGeo = new THREE.SphereGeometry(0.38, 32, 32);
    mainHairGeo.scale(1, 0.5, 1);
    const mainHair = new THREE.Mesh(mainHairGeo, hairMaterial);
    mainHair.position.y = 0.15;
    hairGroup.add(mainHair);

    // Hair spikes/texture
    for (let i = 0; i < 12; i++) {
      const spikeGeo = new THREE.ConeGeometry(0.08, 0.15, 6);
      const spike = new THREE.Mesh(spikeGeo, hairMaterial);
      const angle = (i / 12) * Math.PI * 2;
      const radius = 0.25 + Math.random() * 0.1;
      spike.position.set(
        Math.cos(angle) * radius,
        0.2 + Math.random() * 0.1,
        Math.sin(angle) * radius * 0.8
      );
      spike.rotation.x = Math.random() * 0.3 - 0.15;
      spike.rotation.z = Math.random() * 0.3 - 0.15;
      hairGroup.add(spike);
    }

    hairGroup.position.y = 1.6;
    avatarGroup.add(hairGroup);
    this.hair = hairGroup;

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
    leftEye.position.set(-0.1, 1.65, 0.3);
    avatarGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
    rightEye.position.set(0.1, 1.65, 0.3);
    avatarGroup.add(rightEye);

    this.leftEye = leftEye;
    this.rightEye = rightEye;

    // Eyebrows
    const browGeo = new THREE.BoxGeometry(0.1, 0.02, 0.02);
    const browMat = new THREE.MeshStandardMaterial({ color: 0x8b7355 });

    const leftBrow = new THREE.Mesh(browGeo, browMat);
    leftBrow.position.set(-0.1, 1.73, 0.32);
    leftBrow.rotation.z = 0.1;
    avatarGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, browMat);
    rightBrow.position.set(0.1, 1.73, 0.32);
    rightBrow.rotation.z = -0.1;
    avatarGroup.add(rightBrow);

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.04, 0.1, 8);
    const nose = new THREE.Mesh(noseGeo, skinMaterial);
    nose.position.set(0, 1.58, 0.35);
    nose.rotation.x = -Math.PI / 2;
    avatarGroup.add(nose);

    // Mouth
    const mouthGeo = new THREE.TorusGeometry(0.06, 0.015, 8, 16, Math.PI);
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0xc4877a });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 1.48, 0.32);
    mouth.rotation.x = Math.PI;
    avatarGroup.add(mouth);
    this.mouth = mouth;

    // Stubble effect (subtle texture on lower face)
    const stubbleGeo = new THREE.SphereGeometry(0.32, 32, 32);
    const stubbleMat = new THREE.MeshStandardMaterial({
      color: 0xb8935a,
      transparent: true,
      opacity: 0.15,
      roughness: 1
    });
    const stubble = new THREE.Mesh(stubbleGeo, stubbleMat);
    stubble.position.set(0, 1.52, 0.05);
    stubble.scale.set(1, 0.4, 0.8);
    avatarGroup.add(stubble);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.2, 16);
    const neck = new THREE.Mesh(neckGeo, skinMaterial);
    neck.position.y = 1.3;
    avatarGroup.add(neck);

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.35, 0.3, 0.8, 16);
    const torso = new THREE.Mesh(torsoGeo, shirtMaterial);
    torso.position.y = 0.85;
    torso.castShadow = true;
    avatarGroup.add(torso);
    this.torso = torso;

    // Shoulders
    const shoulderGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const leftShoulder = new THREE.Mesh(shoulderGeo, shirtMaterial);
    leftShoulder.position.set(-0.4, 1.1, 0);
    avatarGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, shirtMaterial);
    rightShoulder.position.set(0.4, 1.1, 0);
    avatarGroup.add(rightShoulder);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.5, 12);

    // Left arm
    const leftArmUpper = new THREE.Mesh(armGeo, shirtMaterial);
    leftArmUpper.position.set(-0.5, 0.85, 0);
    leftArmUpper.rotation.z = 0.2;
    avatarGroup.add(leftArmUpper);
    this.leftArmUpper = leftArmUpper;

    const leftArmLower = new THREE.Mesh(armGeo, skinMaterial);
    leftArmLower.position.set(-0.6, 0.45, 0.1);
    leftArmLower.rotation.z = 0.3;
    leftArmLower.rotation.x = -0.2;
    avatarGroup.add(leftArmLower);
    this.leftArmLower = leftArmLower;

    // Right arm
    const rightArmUpper = new THREE.Mesh(armGeo, shirtMaterial);
    rightArmUpper.position.set(0.5, 0.85, 0);
    rightArmUpper.rotation.z = -0.2;
    avatarGroup.add(rightArmUpper);
    this.rightArmUpper = rightArmUpper;

    const rightArmLower = new THREE.Mesh(armGeo, skinMaterial);
    rightArmLower.position.set(0.6, 0.45, 0.1);
    rightArmLower.rotation.z = -0.3;
    rightArmLower.rotation.x = -0.2;
    avatarGroup.add(rightArmLower);
    this.rightArmLower = rightArmLower;

    // Hands
    const handGeo = new THREE.SphereGeometry(0.07, 12, 12);
    const leftHand = new THREE.Mesh(handGeo, skinMaterial);
    leftHand.position.set(-0.65, 0.2, 0.15);
    avatarGroup.add(leftHand);
    this.leftHand = leftHand;

    const rightHand = new THREE.Mesh(handGeo, skinMaterial);
    rightHand.position.set(0.65, 0.2, 0.15);
    avatarGroup.add(rightHand);
    this.rightHand = rightHand;

    // Accent elements (tech-themed)
    // Glowing bracelet/watch
    const watchGeo = new THREE.TorusGeometry(0.09, 0.02, 8, 16);
    const watch = new THREE.Mesh(watchGeo, accentMaterial);
    watch.position.set(-0.6, 0.35, 0.1);
    watch.rotation.x = Math.PI / 2;
    avatarGroup.add(watch);
    this.watch = watch;

    // Platform/base
    const baseGeo = new THREE.CylinderGeometry(0.6, 0.7, 0.1, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.5,
      roughness: 0.3
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.05;
    base.receiveShadow = true;
    avatarGroup.add(base);

    // Base ring
    const ringGeo = new THREE.TorusGeometry(0.65, 0.03, 8, 32);
    const ring = new THREE.Mesh(ringGeo, accentMaterial);
    ring.position.y = 0.1;
    ring.rotation.x = Math.PI / 2;
    avatarGroup.add(ring);
    this.baseRing = ring;

    this.avatar = avatarGroup;
    this.group.add(avatarGroup);
  }

  async show() {
    return new Promise(resolve => {
      this.group.visible = true;
      this.isVisible = true;

      // Entrance animation
      this.group.position.y = -2;
      this.group.scale.set(0.1, 0.1, 0.1);

      const tl = gsap.timeline({ onComplete: resolve });

      tl.to(this.group.position, {
        y: 0,
        duration: 1,
        ease: 'power2.out'
      });

      tl.to(this.group.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.5)'
      }, '-=1');

      // Wave hello
      tl.call(() => this.playWave(), null, '+=0.3');
    });
  }

  playWave() {
    // Wave animation
    const tl = gsap.timeline();

    // Raise right arm
    tl.to(this.rightArmUpper.rotation, {
      z: -1.5,
      x: 0.5,
      duration: 0.4,
      ease: 'power2.out'
    });

    tl.to(this.rightArmLower.position, {
      x: 0.7,
      y: 1.1,
      z: 0.2,
      duration: 0.4
    }, '-=0.4');

    tl.to(this.rightArmLower.rotation, {
      z: -1.2,
      x: 0.3,
      duration: 0.4
    }, '-=0.4');

    tl.to(this.rightHand.position, {
      x: 0.75,
      y: 1.4,
      z: 0.3,
      duration: 0.4
    }, '-=0.4');

    // Wave motion
    for (let i = 0; i < 3; i++) {
      tl.to(this.rightHand.rotation, {
        z: 0.3,
        duration: 0.15
      });
      tl.to(this.rightHand.rotation, {
        z: -0.3,
        duration: 0.15
      });
    }

    // Return to idle
    tl.to(this.rightArmUpper.rotation, {
      z: -0.2,
      x: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    }, '+=0.2');

    tl.to(this.rightArmLower.position, {
      x: 0.6,
      y: 0.45,
      z: 0.1,
      duration: 0.5
    }, '-=0.5');

    tl.to(this.rightArmLower.rotation, {
      z: -0.3,
      x: -0.2,
      duration: 0.5
    }, '-=0.5');

    tl.to(this.rightHand.position, {
      x: 0.65,
      y: 0.2,
      z: 0.15,
      duration: 0.5
    }, '-=0.5');

    tl.to(this.rightHand.rotation, {
      z: 0,
      duration: 0.3
    }, '-=0.3');
  }

  playGesture(sectionName) {
    this.currentGesture = sectionName;

    switch (sectionName) {
      case 'welcome':
        // Already did wave on show
        break;
      case 'about':
        this.playThinkingGesture();
        break;
      case 'experience':
        this.playPointingGesture('left');
        break;
      case 'skills':
        this.playOpenArmsGesture();
        break;
      case 'education':
        this.playPointingGesture('up');
        break;
      case 'contact':
        this.playWave();
        break;
    }
  }

  playThinkingGesture() {
    const tl = gsap.timeline();

    // Hand to chin
    tl.to(this.leftArmUpper.rotation, {
      z: 1,
      duration: 0.4
    });

    tl.to(this.leftHand.position, {
      x: -0.1,
      y: 1.45,
      z: 0.4,
      duration: 0.4
    }, '-=0.4');

    // Head tilt
    tl.to(this.head.rotation, {
      z: 0.1,
      duration: 0.3
    });

    // Return after delay
    tl.to(this.leftArmUpper.rotation, {
      z: 0.2,
      duration: 0.5
    }, '+=2');

    tl.to(this.leftHand.position, {
      x: -0.65,
      y: 0.2,
      z: 0.15,
      duration: 0.5
    }, '-=0.5');

    tl.to(this.head.rotation, {
      z: 0,
      duration: 0.3
    }, '-=0.3');
  }

  playPointingGesture(direction) {
    const tl = gsap.timeline();

    if (direction === 'left') {
      tl.to(this.rightArmUpper.rotation, {
        z: -1.2,
        duration: 0.4
      });

      tl.to(this.rightHand.position, {
        x: 1.2,
        y: 1,
        z: 0.2,
        duration: 0.4
      }, '-=0.4');
    } else if (direction === 'up') {
      tl.to(this.rightArmUpper.rotation, {
        z: -1.8,
        x: 0.3,
        duration: 0.4
      });

      tl.to(this.rightHand.position, {
        x: 0.4,
        y: 1.8,
        z: 0.2,
        duration: 0.4
      }, '-=0.4');
    }

    // Return
    tl.to(this.rightArmUpper.rotation, {
      z: -0.2,
      x: 0,
      duration: 0.5
    }, '+=2');

    tl.to(this.rightHand.position, {
      x: 0.65,
      y: 0.2,
      z: 0.15,
      duration: 0.5
    }, '-=0.5');
  }

  playOpenArmsGesture() {
    const tl = gsap.timeline();

    // Both arms out
    tl.to(this.leftArmUpper.rotation, {
      z: 1,
      duration: 0.4
    });

    tl.to(this.rightArmUpper.rotation, {
      z: -1,
      duration: 0.4
    }, '-=0.4');

    tl.to(this.leftHand.position, {
      x: -1.1,
      y: 0.9,
      duration: 0.4
    }, '-=0.4');

    tl.to(this.rightHand.position, {
      x: 1.1,
      y: 0.9,
      duration: 0.4
    }, '-=0.4');

    // Return
    tl.to([this.leftArmUpper.rotation, this.rightArmUpper.rotation], {
      z: (i) => i === 0 ? 0.2 : -0.2,
      duration: 0.5
    }, '+=2');

    tl.to(this.leftHand.position, {
      x: -0.65,
      y: 0.2,
      duration: 0.5
    }, '-=0.5');

    tl.to(this.rightHand.position, {
      x: 0.65,
      y: 0.2,
      duration: 0.5
    }, '-=0.5');
  }

  setSpeaking(speaking) {
    this.isSpeaking = speaking;
  }

  update(time) {
    if (!this.isVisible) return;

    // Idle breathing animation
    const breathe = Math.sin(time * 2) * 0.02;
    if (this.torso) {
      this.torso.scale.y = 1 + breathe;
      this.torso.position.y = 0.85 + breathe * 2;
    }

    // Subtle head movement
    if (this.head) {
      this.head.rotation.y = Math.sin(time * 0.5) * 0.05;
      this.head.position.y = 1.6 + breathe * 3;
    }

    // Eye blinking
    const blinkCycle = time % 4;
    if (blinkCycle > 3.8 && blinkCycle < 3.95) {
      if (this.leftEye) this.leftEye.scale.y = 0.1;
      if (this.rightEye) this.rightEye.scale.y = 0.1;
    } else {
      if (this.leftEye) this.leftEye.scale.y = 1;
      if (this.rightEye) this.rightEye.scale.y = 1;
    }

    // Talking mouth animation
    if (this.isSpeaking && this.mouth) {
      const talk = Math.abs(Math.sin(time * 15)) * 0.3 + 0.7;
      this.mouth.scale.y = talk;
    } else if (this.mouth) {
      this.mouth.scale.y = 1;
    }

    // Pulsing accent elements
    if (this.watch) {
      const pulse = (Math.sin(time * 3) + 1) * 0.15 + 0.2;
      this.watch.material.emissiveIntensity = pulse;
    }

    if (this.baseRing) {
      const pulse = (Math.sin(time * 2) + 1) * 0.2 + 0.2;
      this.baseRing.material.emissiveIntensity = pulse;
    }
  }
}
