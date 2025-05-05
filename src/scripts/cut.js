import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, listener, sound;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / (window.innerHeight * 0.8),
  0.1,
  10000
);

renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
renderer.setClearColor(0x87ceeb);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

listener = new THREE.AudioListener();
sound = new THREE.Audio(listener);
camera.add(listener);

const container = document.getElementById("three-container");
container.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1.75, 2.25);
// orbit.enablePan = false;
// orbit.enableRotate = false;
// orbit.enableZoom = false;
orbit.update();

// lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(-20, 5, 20);
sunLight.castShadow = true;
scene.add(sunLight);

// cupboard
const cupboard = new THREE.Mesh(
  new THREE.BoxGeometry(4, 1.5, 2.5),
  new THREE.MeshStandardMaterial({
    color: 0x8b8b8b,
    roughness: 0.75,
    metalness: 0.75,
  })
);
cupboard.position.set(0, 0, 0);
cupboard.castShadow = true;
cupboard.receiveShadow = true;
scene.add(cupboard);

// load banana
const loader = new GLTFLoader();

let banana;
const bananaMesh = [];
loader.load(
  "/models/banana.glb",
  (gltf) => {
    banana = gltf.scene;
    banana.position.set(0, 0.85, 0);
    banana.scale.set(0.025, 0.025, 0.025);
    banana.rotateX(90 * (Math.PI / 180));
    banana.rotateY(90 * (Math.PI / 180));
    scene.add(banana);

    // for raycasting
    banana.traverse((child) => {
      if (child.isMesh) {
        bananaMesh.push(child);
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

window.addEventListener("click", (event) => {
  if (!banana || bananaMesh.length === 0) return;

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(bananaMesh, true);

  if (intersects.length > 0) {
    // banana clicked
    // TODO: add cut
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / (window.innerHeight * 0.8);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
});

document.getElementById("btnToggleWireframe").addEventListener("click", () => {
  scene.traverse((object) => {
    if (object.isMesh) {
      object.material.wireframe = !object.material.wireframe;
    }
  });
});

function animate() {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
