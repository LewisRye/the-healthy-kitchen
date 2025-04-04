import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

var scene,
  camera,
  renderer,
  clock,
  fridgeMixer,
  fridgeAnimations,
  fridgeActions,
  bananaMixer,
  cherryMixer,
  grapeMixer;

var fridgeOpen = false;
var wireframe = false;

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
camera.position.set(0, 3, 5);
orbit.update();

// add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(5, 10, 5);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 50;
scene.add(sunLight);

// add floor
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load(
  "https://dl.polyhaven.org/file/ph-assets/Textures/png/1k/granite_tile/granite_tile_rough_1k.png"
);
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(10, 10);
const floorGeometry = new THREE.PlaneGeometry(25, 25);
const floorMaterial = new THREE.MeshLambertMaterial({
  map: floorTexture,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// for debugging only
// const gridHelper = new THREE.GridHelper(12, 12);
// scene.add(gridHelper);

// for debugging only
// const axesHelper = new THREE.AxesHelper(4);
// scene.add(axesHelper);

// load all models
let fridge;
let banana;
let cherry;
let grape;

const loader = new GLTFLoader();
loader.load(
  "/models/fridge.glb",
  function (gltf) {
    fridge = gltf.scene;
    fridge.position.set(0, 1.5, 0);
    scene.add(fridge);

    // for animations
    fridgeMixer = new THREE.AnimationMixer(gltf.scene);
    fridgeAnimations = gltf.animations;
    fridgeActions = fridgeAnimations.map((clip) =>
      fridgeMixer.clipAction(clip)
    );
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
loader.load(
  "/models/banana.gltf",
  function (gltf) {
    banana = gltf.scene;
    banana.scale.set(0.01, 0.01, 0.01);
    banana.position.set(0, 1.5, 0);
    banana.rotateZ(80);
    scene.add(banana);

    // for animations
    bananaMixer = new THREE.AnimationMixer(banana);
    const bananaAnimations = gltf.animations;
    bananaAnimations.forEach((clip) => {
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
    cherry.scale.set(0.09, 0.09, 0.09);
    cherry.position.set(0, 0.75, 0);
    scene.add(cherry);

    // for animations
    cherryMixer = new THREE.AnimationMixer(cherry);
    const cherryAnimations = gltf.animations;
    cherryAnimations.forEach((clip) => {
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
    grape.scale.set(0.05, 0.04, 0.05);
    grape.position.set(0, 0.1, 0);
    scene.add(grape);

    // for animations
    grapeMixer = new THREE.AnimationMixer(grape);
    const grapeAnimations = gltf.animations;
    grapeAnimations.forEach((clip) => {
      const action = grapeMixer.clipAction(clip);
      actions.push(action);
    });
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// open fridge button
document.getElementById("btnOpenFridge").addEventListener("click", function () {
  if (fridgeActions.length > 0 && !fridgeOpen) {
      for (let action of fridgeActions) {
        // play until frame 40 (fully open)
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.timeScale = 1;
        action.reset();
        action.play();

        action.onFinish = () => {
          action.time = 40;
          action.paused = true;
        };
      }
      fridgeOpen = true;
    }
});

// close fridge button
document
  .getElementById("btnCloseFridge")
  .addEventListener("click", function () {
    if (fridgeActions.length > 0 && fridgeOpen) {
        for (let action of fridgeActions) {
          // play from frame 40 until frame 80 (fully closed)
          action.time = 40;
          action.timeScale = -1;
          action.play();
        }
        fridgeOpen = false;
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
  const delta = clock.getDelta();

  if (fridgeMixer) fridgeMixer.update(delta);
  if (bananaMixer) bananaMixer.update(delta);
  if (cherryMixer) cherryMixer.update(delta);
  if (grapeMixer) grapeMixer.update(delta);

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
