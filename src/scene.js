import * as THREE from 'three';
import frag from './shaders/metaball.frag';
import vert from './shaders/passthrough.vert';
import { generateAnchorPoints } from './scene3';

export function initScene() {
  //generate anchor points and get their cordinates
  const targetPoints = generateAnchorPoints("Verdana", 600, 24, "Hello!");
  console.log(`[INFO] number of anchor points: ${targetPoints.length}`);
  console.log('[INFO] canvas points: ', targetPoints)

  //scaling issues persist in perspective view but fk it we roll
  const normalisedTargetPoints = [];
  for(let i=0; i<targetPoints.length;i++){
    normalisedTargetPoints[i] = canvasToWebGL(targetPoints[i].x, targetPoints[i].y, window.innerWidth, window.innerHeight);
  }

  console.log('[INFO] webgl points: ', normalisedTargetPoints)

  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.setSize(window.innerWidth, window.innerHeight); //why tf does this always have margins, remove the margins later

  renderer.setClearColor(0xffffff, 1);

  const scene = new THREE.Scene();

  // const camera = new THREE.PerspectiveCamera(
  //   75,                       // Field of view
  //   window.innerWidth / window.innerHeight, // Aspect ratio
  //   0.1,                      // Near plane
  //   1000                      // Far plane
  // );
  // camera.position.z = 1;

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;


  const blobCount = targetPoints.length; // one blob for each anchor
  const blobPositions = new Float32Array(blobCount * 2);
  //for now we random spawn the blobs on the canvas
  for (let i = 0; i < blobCount; i++) {
    blobPositions[i * 2] = Math.random() * 2 - 1;
    blobPositions[i * 2 + 1] = Math.random() * 2 - 1;
  }

  const uniforms = {
    iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    iTime: { value: 0 },
    uBlobs: { value: blobPositions },
    uBlobCount: { value: blobCount },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);

  // dev
  // for (const pt of normalisedTargetPoints) {
  //   const circle = new THREE.Mesh(
  //     new THREE.CircleGeometry(0.005, 16),
  //     new THREE.MeshBasicMaterial({ color: 0xff0000 })
  //   );
  //   circle.position.set(pt.x, pt.y, 0);
  //   scene.add(circle);
  // }

  function animate(t) {
    uniforms.iTime.value = t * 0.001;

    for (let i = 0; i < blobCount; i++) {
      const target = normalisedTargetPoints[i] || { x: 0, y: 0 };
      
      const px = uniforms.uBlobs.value[i * 2];
      const py = uniforms.uBlobs.value[i * 2 + 1];

      const dx = target.x - px;
      const dy = target.y - py;

      uniforms.uBlobs.value[i * 2] += dx * 0.025;
      uniforms.uBlobs.value[i * 2 + 1] += dy * 0.025;
    }

    uniforms.uBlobs.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  
  animate();

}

function canvasToWebGL(x, y, canvasWidth, canvasHeight) {
  const ndcX = (x / canvasWidth) * 2 - 1;          // map x from [0, width] → [-1, 1]
  const ndcY = 1 - (y / canvasHeight) * 2;         // map y from [0, height] → [1, -1]
  return { x: ndcX, y: ndcY };
}

