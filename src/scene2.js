import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { Wireframe } from 'three/examples/jsm/Addons.js';


export function initScene() {
    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    // For a 2D look, we use an Orthographic Camera
    const aspectRatio = window.innerWidth / window.innerHeight;
    const frustumSize = 20;
    const camera = new THREE.OrthographicCamera(
        frustumSize * aspectRatio / -2,
        frustumSize * aspectRatio / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.1,
        100
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Store the generated points here
    const sampledPoints = [];

    // 2. Load Font and Generate Geometry
    const fontLoader = new FontLoader();
    fontLoader.load(
        // URL to a typeface.json font
        'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json',

        // onLoad callback
        (font) => {
            // -- Create the Text Mesh --
            const textGeometry = new TextGeometry('ANCHORS', {
                font: font,
                size: 5,
                height: 0, // This is the "depth" of the text
                curveSegments: 12,
                bevelEnabled: false
            });

            // Center the geometry so it's easy to position
            textGeometry.center();

            const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe : true });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            scene.add(textMesh);

            // 3. Sample Points from the Text Mesh Surface
            const sampler = new MeshSurfaceSampler(textMesh).build();

            const sampledPoints = [];
            const temp = new THREE.Vector3();
            for (let i = 0; i < 5000; i++) {
                sampler.sample(temp);
                sampledPoints.push(temp.clone());
            }

            // Visualize sampled points
            const pointsGeo = new THREE.BufferGeometry().setFromPoints(sampledPoints);
            const pointsMat = new THREE.PointsMaterial({ color: 0xff0000, size: 0.01 });
            const pointMesh = new THREE.Points(pointsGeo, pointsMat);
            scene.add(pointMesh);

            // const numberOfPoints = 3000;
            // const pointsGeometry = new THREE.BufferGeometry();
            // const pointsArray = new Float32Array(numberOfPoints * 3);

            // const _position = new THREE.Vector3(); // Reusable vector

            // for (let i = 0; i < numberOfPoints; i++) {
            //     sampler.sample(_position);
            //     pointsArray[i * 3] = _position.x;
            //     pointsArray[i * 3 + 1] = _position.y;
            //     pointsArray[i * 3 + 2] = _position.z;

            //     // Add the sampled point to our array for later use
            //     sampledPoints.push(_position.clone());
            // }

            // pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointsArray, 3));

            // const pointsMaterial = new THREE.PointsMaterial({
            //     color: 0xff61d5,
            //     size: 0.075
            // });

            // const points = new THREE.Points(pointsGeometry, pointsMaterial);
            // scene.add(points);

            // You can now access the points!
            console.log('Generated anchor points:', sampledPoints);
            // Example: Access the first point's coordinates
            // console.log('First point X:', sampledPoints[0].x);
        },

        // onProgress callback (optional)
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },

        // onError callback (optional)
        (err) => {
            console.error('An error happened during font loading.', err);
        }
    );

    // 4. Render Loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resizing
    window.addEventListener('resize', () => {
        const newAspectRatio = window.innerWidth / window.innerHeight;
        camera.left = frustumSize * newAspectRatio / -2;
        camera.right = frustumSize * newAspectRatio / 2;
        camera.top = frustumSize / 2;
        camera.bottom = frustumSize / -2;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
