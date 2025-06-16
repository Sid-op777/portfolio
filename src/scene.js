import * as THREE from 'three';
import frag from './shaders/metaball.frag';
import vert from './shaders/passthrough.vert';
import { Text } from 'troika-three-text';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';


export function initScene() {
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  renderer.setClearColor(0xffffff, 1);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,                       // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1,                      // Near plane
    1000                      // Far plane
  );
  camera.position.z = 1;

  // const blobCount = 90;
  // const positions = new Float32Array(blobCount * 2);
  // for (let i = 0; i < blobCount; i++) {
  //   positions[i * 2] = Math.random() * 2 - 1;
  //   positions[i * 2 + 1] = Math.random() * 2 - 1;
  // }

  // const uniforms = {
  //   iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  //   iTime: { value: 0 },
  //   uBlobs: { value: positions },
  //   uBlobCount: { value: blobCount },
  // };

  // const material = new THREE.ShaderMaterial({
  //   uniforms,
  //   vertexShader: vert,
  //   fragmentShader: frag,
  // });

  // const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  // scene.add(quad);

  // Add the Troika text (for shape reference)
  const textMesh = new Text();
  scene.add(textMesh);
  
  textMesh.text = 'Hello!';
  textMesh.fontSize = 0.3;
  textMesh.position.z = 0;
  textMesh.color = 0x000000

  textMesh.sync(() => {
    const sampler = new MeshSurfaceSampler(textMesh)
      .setWeightAttribute(null) // optional, unless you want to bias sampling
      .build();

    const pointCount = 500;
    const sampledPoints = [];

    const tempPosition = new THREE.Vector3();

    for (let i = 0; i < pointCount; i++) {
      sampler.sample(tempPosition);
      sampledPoints.push(tempPosition.clone());
    }

    console.log('[INFO] Sampled points:', sampledPoints);

    // For dev: visualize them
    const pointsGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
    const pointsMaterial = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.01 });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    // Use `sampledPoints` for blob anchors later
  });

  

  let targetPoints = [];

  // Use a delay to ensure the geometry is complete
  // setTimeout(() => {
  //   targetPoints = getTextPoints(textMesh, 0.05).slice(0, 500);
  //   console.log(`[INFO] Collected ${targetPoints.length} points from text`);
  // }, 100); // 100ms delay is usually enough

  function animate(t) {
    // uniforms.iTime.value = t * 0.001;

    // for (let i = 0; i < blobCount; i++) {
    //   const target = targetPoints[i] || new THREE.Vector2(0, -1.5);
    //   const px = uniforms.uBlobs.value[i * 2];
    //   const py = uniforms.uBlobs.value[i * 2 + 1];
    //   const dx = target.x - px;
    //   const dy = target.y - py;

    //   uniforms.uBlobs.value[i * 2] += dx * 0.05;
    //   uniforms.uBlobs.value[i * 2 + 1] += dy * 0.05;
    // }

    //dev, remove 
    // for (const pt of targetPoints) {
    //   const circle = new THREE.Mesh(
    //     new THREE.CircleGeometry(0.005, 16),
    //     new THREE.MeshBasicMaterial({ color: 0xff0000 })
    //   );
    //   circle.position.set(pt.x, pt.y, 0);
    //   scene.add(circle);
    // }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

// Improved sampling function with logging
function getTextPoints(mesh, spacing) {
  const points = [];

  if (!mesh.geometry || !mesh.geometry.boundingBox) {
    console.warn('[WARN] Text geometry not ready.');
    return points;
  }

  mesh.geometry.computeBoundingBox();
  const bounds = mesh.geometry.boundingBox;
  console.log(bounds);
  const minX = bounds.min.x;
  const maxX = bounds.max.x;
  const minY = bounds.min.y;
  const maxY = bounds.max.y;

  const raycaster = new THREE.Raycaster();
  const direction = new THREE.Vector3(0, 0, -1);

  for (let y = minY; y <= maxY; y += spacing) {
    for (let x = minX; x <= maxX; x += spacing) {
      const origin = new THREE.Vector3(x, y, 5);
      raycaster.set(origin, direction);

      const hits = raycaster.intersectObject(mesh, true);
      if (hits.length > 0) {
        // // Map text space -> screen [-1, 1] space
        // const normX = ((x - minX) / (maxX - minX)) * 2 - 1;
        // const normY = ((y - minY) / (maxY - minY)) * 2 - 1;

        // Flip Y axis (WebGL is bottom-left origin, Three.js is top-left)
        // points.push(new THREE.Vector2(normX, normY));
        points.push(new THREE.Vector2(x, y));
      }
    }
  }

  if (points.length === 0) {
    console.warn('[WARN] No intersected text points.');
  }

  // console.log(points);
  return points;
}