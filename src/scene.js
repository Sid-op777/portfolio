import * as THREE from 'three';
import frag from './shaders/metaball.frag';
import vert from './shaders/passthrough.vert';

export function initScene() {
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();

  const blobCount = 10;
  const positions = new Float32Array(blobCount * 2);
  for (let i = 0; i < blobCount; i++) {
    positions[i * 2] = Math.random() * 2 - 1;
    positions[i * 2 + 1] = Math.random() * 2 - 1;
  }

  const uniforms = {
    iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    iTime: { value: 0 },
    uBlobs: { value: positions },
    uBlobCount: { value: blobCount },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  function animate(t) {
    uniforms.iTime.value = t * 0.001;

    // Update blob positions over time
    for (let i = 0; i < blobCount; i++) {
      const angle = uniforms.iTime.value + i;
      uniforms.uBlobs.value[i * 2] = Math.sin(angle) * 0.5;
      uniforms.uBlobs.value[i * 2 + 1] = Math.cos(angle * 1.2) * 0.5;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}
