import * as THREE from 'three';

export function createLighting(scene) {
  // Ambient light for base illumination
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  // Main key light (warm, from top-front-right)
  const keyLight = new THREE.DirectionalLight(0xfff5e6, 1);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 50;
  keyLight.shadow.camera.left = -10;
  keyLight.shadow.camera.right = 10;
  keyLight.shadow.camera.top = 10;
  keyLight.shadow.camera.bottom = -10;
  keyLight.shadow.bias = -0.0001;
  scene.add(keyLight);

  // Fill light (cool, from left)
  const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.5);
  fillLight.position.set(-5, 3, 2);
  scene.add(fillLight);

  // Rim light (accent green, from behind)
  const rimLight = new THREE.DirectionalLight(0xa3e635, 0.3);
  rimLight.position.set(0, 3, -5);
  scene.add(rimLight);

  // Point light for avatar area
  const avatarLight = new THREE.PointLight(0xffffff, 0.5, 10);
  avatarLight.position.set(2, 2, 2);
  scene.add(avatarLight);

  // Accent spotlight on avatar
  const spotlight = new THREE.SpotLight(0xa3e635, 0.5, 15, Math.PI / 6, 0.3);
  spotlight.position.set(2, 5, 3);
  spotlight.target.position.set(2, 0, 0);
  scene.add(spotlight);
  scene.add(spotlight.target);

  // Hemisphere light for natural sky/ground coloring
  const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x1a1a2e, 0.3);
  scene.add(hemiLight);

  // Ground plane for shadows
  const groundGeo = new THREE.PlaneGeometry(50, 50);
  const groundMat = new THREE.ShadowMaterial({
    opacity: 0.3
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  scene.add(ground);

  // Environment gradient sphere (creates depth)
  const envGeo = new THREE.SphereGeometry(40, 32, 32);
  const envMat = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(0x1a1a2e) },
      bottomColor: { value: new THREE.Color(0x0a0a0f) },
      offset: { value: 10 },
      exponent: { value: 0.6 }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    `,
    side: THREE.BackSide
  });
  const envSphere = new THREE.Mesh(envGeo, envMat);
  scene.add(envSphere);

  return {
    keyLight,
    fillLight,
    rimLight,
    avatarLight,
    spotlight
  };
}

export default createLighting;
