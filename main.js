import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

var scene, camera, renderer, clock, bananaMixer, cherryMixer, grapeMixer;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / (window.innerHeight * 0.8),
  0.1,
  1000
);
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
renderer.setClearColor(0x87ceeb);

const container = document.getElementById("three-container");
container.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2.5, 5);
orbit.update();

// for debugging only
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

// for debugging only
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

// load all models
let banana;
let cherry;
let grape;

const loader = new GLTFLoader();
loader.load(
  "/models/banana.gltf",
  function (gltf) {
    banana = gltf.scene;
    scene.add(banana);

    // for animations
    bananaMixer = new THREE.AnimationMixer(banana);
    const animations = gltf.animations;
    animations.forEach((clip) => {
      const action = bananaMixer.clipAction(clip);
      actions.push(action);
    });
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
loader.load(
  "/models/cherry.gltf",
  function (gltf) {
    cherry = gltf.scene;
    cherry.scale.set(15, 15, 15);
    cherry.position.set(-90, 0, 0);
    scene.add(cherry);

    // for animations
    cherryMixer = new THREE.AnimationMixer(cherry);
    const animations = gltf.animations;
    animations.forEach((clip) => {
      const action = cherryMixer.clipAction(clip);
      actions.push(action);
    });
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
loader.load(
  "/models/grape.gltf",
  function (gltf) {
    grape = gltf.scene;
    grape.scale.set(10, 10, 10);
    grape.position.set(90, 0, 0);
    scene.add(grape);

    // for animations
    grapeMixer = new THREE.AnimationMixer(grape);
    const animations = gltf.animations;
    animations.forEach((clip) => {
      const action = grapeMixer.clipAction(clip);
      actions.push(action);
    });
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

var open = true;
var wireframe = false;

// open fridge button
document.getElementById("btnOpenFridge").addEventListener("click", function () {
  console.log("clicked open button");
  if (actions.length === 2) {
    if (open) {
      actions.forEach((action) => {
        action.timeScale = 1;
        action.reset();
        action.play();
      });
    }
  }
});

// close fridge button
document
  .getElementById("btnCloseFridge")
  .addEventListener("click", function () {
    console.log("clicked close button");
    if (actions.length === 2) {
      if (open) {
        actions.forEach((action) => {
          action.timeScale = 1;
          action.reset();
          action.play();
        });
      }
    }
  });

// toggle wireframe button
document
  .getElementById("btnToggleWireframe")
  .addEventListener("click", function () {
    console.log("clicked wireframe button");
    wireframe = !wireframe;
    scene.traverse(function (object) {
      if (object.isMesh) {
        object.material.wireframe = wireframe;
      }
    });
  });

clock = new THREE.Clock();

function animate() {
  if (bananaMixer) {
    bananaMixer.update(clock.getDelta());
  }
  if (cherryMixer) {
    cherryMixer.update(clock.getDelta());
  }
  if (grapeMixer) {
    grapeMixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// a function that checks for window resize events
window.addEventListener("resize", () => {
  var width = window.innerWidth;
  var height = window.innerHeight * 0.8;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
