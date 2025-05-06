import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// load information about cherry
async function getData() {
  const url = "http://localhost:3000/food/cherry";
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

let cherry;
let wireframeEnabled = false;

const loader = new GLTFLoader();

const cherryMesh = [];
loader.load(
  "/models/cherry.gltf",
  (gltf) => {
    cherry = gltf.scene;
    cherry.scale.set(20, 20, 20);
    cherry.position.set(0, 0, 0);
    scene.add(cherry);

    cherry.traverse((child) => {
      if (child.isMesh) {
        cherryMesh.push(child);
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
  if (!cherry) return;

  cherry.rotation.y += 0.001;
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
