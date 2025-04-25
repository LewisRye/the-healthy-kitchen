import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let scene,
  camera,
  renderer,
  fridgeMixer,
  fridgeAnimations,
  fridgeActions,
  bananaMixer,
  cherryMixer,
  grapeMixer;

let fridgeOpen = false;
let lightOn = false;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / (window.innerHeight * 0.8),
  0.1,
  10000
);
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
renderer.setClearColor(0x87ceeb);

const container = document.getElementById("three-container");
container.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-7.5, 3, 5);
orbit.update();

// add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 0.75);
sunLight.position.set(5, 10, 5);
sunLight.castShadow = true;
scene.add(sunLight);

// add floor
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load(
  "https://dl.polyhaven.org/file/ph-assets/Textures/png/1k/granite_tile/granite_tile_rough_1k.png"
);
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(2.5, 3.125);
const floorGeometry = new THREE.PlaneGeometry(10, 12.5);
const floorMaterial = new THREE.MeshLambertMaterial({
  map: floorTexture,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// add back wall
const backWallGeometry = new THREE.PlaneGeometry(10, 5);
const backWallMaterial = new THREE.MeshLambertMaterial({ color: 0xfbfdf8 });
const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
backWall.position.set(0, 2.5, -6.2);
scene.add(backWall);

// add right wall
const rightWallGeometry = new THREE.PlaneGeometry(12.5, 5);
const rightWallMaterial = new THREE.MeshLambertMaterial({ color: 0xfbfdf8 });
const rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
rightWall.position.set(5, 2.5, 0);
rightWall.rotation.y = -Math.PI / 2;
scene.add(rightWall);

// add door to right wall
const boxDoorGeometry = new THREE.BoxGeometry(1.8, 3, 0.1);
const boxDoorMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
const boxDoor = new THREE.Mesh(boxDoorGeometry, boxDoorMaterial);
boxDoor.position.set(4.95, 1.5, 5);
boxDoor.rotation.y = -Math.PI / 2;
scene.add(boxDoor);

// add door handle
const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 32);
const handleMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
const handle = new THREE.Mesh(handleGeometry, handleMaterial);
handle.rotation.z = Math.PI / 2;
handle.position.set(4.85, 1.5, 4.2);
scene.add(handle);

// add light switch
const toggleGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.25);
const toggleMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 });
const lightSwitch = new THREE.Mesh(toggleGeometry, toggleMaterial);
lightSwitch.rotation.z = -20; // -20 for off, 20 for on
lightSwitch.position.set(5, 1.75, 3.5);
const switchMesh = [];
lightSwitch.traverse(function (child) {
  if (child.isMesh) {
    switchMesh.push(child);
  }
});
scene.add(lightSwitch);

// load all models
const loader = new GLTFLoader();

let fridge;
const fridgeMesh = [];
loader.load(
  "/models/fridge.glb",
  function (gltf) {
    fridge = gltf.scene;
    fridge.position.set(0, 1.5, -5.5);
    scene.add(fridge);

    // for raycasting
    fridge.traverse(function (child) {
      if (child.isMesh) {
        fridgeMesh.push(child);
      }
    });

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

let banana;
const bananaMesh = [];
loader.load(
  "/models/banana.gltf",
  function (gltf) {
    banana = gltf.scene;
    banana.scale.set(0.01, 0.01, 0.01);
    banana.position.set(0, 1.5, -5.5);
    banana.rotateZ(80);
    scene.add(banana);

    // for raycasting
    banana.traverse(function (child) {
      if (child.isMesh) {
        bananaMesh.push(child);
      }
    });

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

let cherry;
const cherryMesh = [];
loader.load(
  "/models/cherry.gltf",
  function (gltf) {
    cherry = gltf.scene;
    cherry.scale.set(0.09, 0.09, 0.09);
    cherry.position.set(0, 0.75, -5.5);
    scene.add(cherry);

    // for raycasting
    cherry.traverse(function (child) {
      if (child.isMesh) {
        cherryMesh.push(child);
      }
    });

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

let grape;
const grapeMesh = [];
loader.load(
  "/models/grape.gltf",
  function (gltf) {
    grape = gltf.scene;
    grape.scale.set(0.05, 0.04, 0.05);
    grape.position.set(0, 0.1, -5.5);
    scene.add(grape);

    // for raycasting
    grape.traverse(function (child) {
      if (child.isMesh) {
        grapeMesh.push(child);
      }
    });

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

const clock = new THREE.Clock();
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
raycaster.far = 1000;
raycaster.near = 0.1;

window.addEventListener("click", onMouseClick, false);

function onMouseClick(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const fridgeIntersect = raycaster.intersectObject(fridge, true);
  // fridge clicked
  if (
    fridgeIntersect.length > 0 &&
    fridgeMesh.includes(fridgeIntersect[0].object)
  ) {
    if (fridgeActions.length > 0 && fridgeOpen) {
      for (let action of fridgeActions) {
        action.reset();
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.timeScale = 1;
        action.time = 40 / 30;
        action.play();

        setTimeout(() => {
          action.paused = true;
          action.time = 0;
        }, 2000);
      }
      fridgeOpen = false;
    } else if (fridgeActions.length > 0 && !fridgeOpen) {
      for (let action of fridgeActions) {
        action.reset();
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.timeScale = 1;
        action.play();

        setTimeout(() => {
          action.paused = true;
          action.time = 1.33;
        }, 1900);
      }
      fridgeOpen = true;
    }
  }

  const switchIntersect = raycaster.intersectObject(lightSwitch, true);
  // light switch clicked
  if (
    switchIntersect.length > 0 &&
    switchMesh.includes(switchIntersect[0].object)
  ) {
    lightOn = !lightOn;
    lightSwitch.rotation.z = -lightSwitch.rotation.z;

    if (lightOn) {
      renderer.setClearColor(0x303236);
    } else {
      renderer.setClearColor(0x87ceeb);
    }
  }
}

window.addEventListener("resize", () => {
  // resize camera to allow for new window size
  let width = window.innerWidth;
  let height = window.innerHeight * 0.8;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

function animate() {
  let delta = clock.getDelta();

  if (fridgeMixer) fridgeMixer.update(delta);
  if (bananaMixer) bananaMixer.update(delta);
  if (cherryMixer) cherryMixer.update(delta);
  if (grapeMixer) grapeMixer.update(delta);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
