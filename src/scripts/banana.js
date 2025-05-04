import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// load information about banana
async function getData() {
  const url = "http://localhost:3000/food/banana";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }

    const json = await response.json();
    document.getElementById("calories").innerHTML = `${json.calories}cal`;
    document.getElementById(
      "carbohydrates"
    ).innerHTML = `${json.carbohydrates}g`;
    document.getElementById("countries").innerHTML = json.countries;
    document.getElementById("description").innerHTML = json.description;
    document.getElementById("fat").innerHTML = `${json.fat}g`;
    document.getElementById("fibre").innerHTML = `${json.fibre}g`;
    document.getElementById("is_gluten_free").innerHTML = json.is_gluten_free
      ? "✅"
      : "❌";
    document.getElementById("is_vegan").innerHTML = json.is_gluten_free
      ? "✅"
      : "❌";
    document.getElementById("protein").innerHTML = `${json.protein}g`;
    document.getElementById("sugar").innerHTML = `${json.sugar}g`;
    document.getElementById("type").innerHTML = json.type;
    document.getElementById("vitamins").innerHTML = json.vitamins;
  } catch (error) {
    console.error(error.message);
  }
}

getData();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / 2 / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth / 2, window.innerHeight);
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
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
