import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / 2 / (window.innerHeight * 0.75),
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth / 2, window.innerHeight * 0.75);
renderer.setClearColor(0x212529);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const container = document.getElementById("three-container");
container.appendChild(renderer.domElement);

// add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
sunLight.position.set(-5, 2.5, 5);
scene.add(sunLight);

let banana;
let wireframeEnabled = false;

const loader = new GLTFLoader();

const bananaMesh = [];
loader.load(
  "/models/banana.glb",
  (gltf) => {
    banana = gltf.scene;
    banana.scale.set(3, 3, 3);
    banana.rotation.x = 90;
    scene.add(banana);

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
  if (banana) {
    banana.rotation.z -= 0.0025;
  }

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// a function that checks for window resize events
window.addEventListener("resize", () => {
  const width = window.innerWidth / 2;
  const height = window.innerHeight * 0.75;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
