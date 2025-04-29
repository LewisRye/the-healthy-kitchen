import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const container = document.getElementById("three-container");
container.appendChild(renderer.domElement);

// add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(-5, 2.5, 5);
scene.add(sunLight);

let grape;

const loader = new GLTFLoader();

const grapeMesh = [];
loader.load(
  "/models/grape.gltf",
  function (gltf) {
    grape = gltf.scene;
    grape.scale.set(10, 10, 10);
    scene.add(grape);

    grape.traverse(function (child) {
      if (child.isMesh) {
        grapeMesh.push(child);
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

camera.position.z = 150;

// toggle wireframe button
let wireframe = false;
document
  .getElementById("btnToggleWireframe")
  .addEventListener("click", function () {
    wireframe = !wireframe;
    scene.traverse(function (object) {
      if (object.isMesh) {
        object.material.wireframe = wireframe;
      }
    });
  });

function animate() {
  if (grape) {
    grape.rotation.y += 0.005;
  }

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// a function that checks for window resize events
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
