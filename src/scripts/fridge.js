import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90,
  (window.innerWidth * 0.25) / (window.innerHeight * 0.55),
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.25, window.innerHeight * 0.55);
renderer.setClearColor(0x212529);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const container = document.getElementById("three-container");
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(10, 10, 10);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 500;
scene.add(keyLight);

const fillLight = new THREE.PointLight(0xffffff, 0.4);
fillLight.position.set(-10, 5, 5);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.7);
rimLight.position.set(0, 5, -10);
scene.add(rimLight);

let fridge;
let wireframeEnabled = false;

const loader = new GLTFLoader();

const fridgeMesh = [];
loader.load(
  "/models/fridge.glb",
  (gltf) => {
    fridge = gltf.scene;
    fridge.scale.set(50, 50, 50);
    fridge.position.set(0, 0, 0);
    scene.add(fridge);

    fridge.traverse((child) => {
      if (child.isMesh) {
        fridgeMesh.push(child);
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

camera.position.z = 150;

// toggle wireframe button
document.getElementById("btnToggleWireframe").addEventListener("click", () => {
  wireframeEnabled = !wireframeEnabled;
  scene.traverse((object) => {
    if (object.isMesh) {
      object.material.wireframe = wireframeEnabled;
    }
  });
});

function animate() {
  if (!fridge) return;

  fridge.rotation.y += 0.001;
  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// a function that checks for window resize events
window.addEventListener("resize", () => {
  const width = window.innerWidth * 0.3;
  const height = window.innerHeight * 0.55;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
