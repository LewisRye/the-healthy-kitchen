import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let scene,
  camera,
  renderer,
  listener,
  sound,
  fridgeMixer,
  fridgeAnimations,
  fridgeActions;

let fridgeOpen = false;
let lightOn = false;

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
camera.position.set(-5, 2.75, 7.5);
camera.lookAt(0, 0, 0);
orbit.update();

// add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(-20, 5, 20);
sunLight.castShadow = true;
scene.add(sunLight);

const pointLight = new THREE.PointLight(0xffffff, 0);
pointLight.position.set(0, 5, 0);
pointLight.castShadow = true;
scene.add(pointLight);

const fridgeTopLight = new THREE.PointLight(0xffffff, 1);
fridgeTopLight.position.set(0, 1.3, -4);
fridgeTopLight.intensity = 0;
scene.add(fridgeTopLight);

const fridgeBottomLight = new THREE.PointLight(0xffffff, 1);
fridgeBottomLight.position.set(0, 2.5, -4);
fridgeBottomLight.intensity = 0;
scene.add(fridgeBottomLight);

const textureLoader = new THREE.TextureLoader();

// add floor
const floorGeometry = new THREE.BoxGeometry(10, 10, 0.05);
const floorMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.75,
  metalness: 0.25,
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// add wall texture
const wallGeometry = new THREE.BoxGeometry(10, 5, 0.05);
const wallMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.75,
  metalness: 0.5,
});

// add back wall
const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
backWall.position.set(0, 2.5, -5);
scene.add(backWall);

// add right wall
const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
rightWall.position.set(5, 2.5, 0);
rightWall.rotation.y = -Math.PI / 2;
scene.add(rightWall);

// add cupboards
const shortCupboardGeometry = new THREE.BoxGeometry(1.25, 1.5, 1);
const longCupboardGeometry = new THREE.BoxGeometry(4, 1.5, 1);
const cupboardMaterial = new THREE.MeshStandardMaterial({
  color: 0x8b8b8b,
  roughness: 0.75,
  metalness: 0.75,
});

const cupboard1 = new THREE.Mesh(longCupboardGeometry, cupboardMaterial);
cupboard1.position.set(3, 0.75, -4.5);
cupboard1.castShadow = true;
cupboard1.receiveShadow = true;
scene.add(cupboard1);

const cupboard2 = new THREE.Mesh(shortCupboardGeometry, cupboardMaterial);
cupboard2.position.set(1.65, 3, -4.5);
cupboard2.castShadow = true;
cupboard2.receiveShadow = true;
scene.add(cupboard2);

const cupboard3 = new THREE.Mesh(shortCupboardGeometry, cupboardMaterial);
cupboard3.position.set(4.35, 3, -4.5);
cupboard3.castShadow = true;
cupboard3.receiveShadow = true;
scene.add(cupboard3);

const cupboard4 = new THREE.Mesh(longCupboardGeometry, cupboardMaterial);
cupboard4.position.set(4.5, 0.75, -3);
cupboard4.rotation.y = -Math.PI / 2;
cupboard4.castShadow = true;
cupboard4.receiveShadow = true;
scene.add(cupboard4);

// create door texture
const doorGeometry = new THREE.BoxGeometry(1.8, 3, 0.1);
const doorMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.5,
  metalness: 0.1,
});

// create door
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(4.95, 1.5, 2.5);
door.rotation.y = -Math.PI / 2;
scene.add(door);

// add handle to door
const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 32);
const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const handle = new THREE.Mesh(handleGeometry, handleMaterial);
handle.rotation.z = Math.PI / 2;
handle.position.set(4.85, 1.5, 2);
scene.add(handle);

// add light switch
const toggleGeometry = new THREE.BoxGeometry(0.1, 1, 0.75);
const toggleMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const lightSwitch = new THREE.Mesh(toggleGeometry, toggleMaterial);
lightSwitch.position.set(4.9, 2, 0.8);
const switchMesh = [];
lightSwitch.traverse(function (child) {
  if (child.isMesh) {
    switchMesh.push(child);
  }
});
scene.add(lightSwitch);

const textureList = ["wood", "stone", "tiles"]; // all textures
// begin with the texture at the back of the list, this is to
// ensure that when calling setTexture, the first texture is set
let currentTexture = textureList[textureList.length - 1];
setTexture();

// load all models
const loader = new GLTFLoader();

let fridge;
const fridgeMesh = [];
loader.load(
  "/models/fridge.glb",
  function (gltf) {
    fridge = gltf.scene;
    fridge.position.set(0, 1.525, -4.5);
    scene.add(fridge);

    // for raycasting
    fridge.traverse(function (child) {
      if (child.isMesh) {
        fridgeMesh.push(child);
        child.castShadow = true;
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
    banana.position.set(0, 1.5, -4.5);
    banana.rotateZ(80);
    scene.add(banana);

    // for raycasting
    banana.traverse(function (child) {
      if (child.isMesh) {
        bananaMesh.push(child);
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

let cherry;
const cherryMesh = [];
loader.load(
  "/models/cherry.gltf",
  function (gltf) {
    cherry = gltf.scene;
    cherry.scale.set(0.09, 0.09, 0.09);
    cherry.position.set(0, 0.75, -4.5);
    scene.add(cherry);

    // for raycasting
    cherry.traverse(function (child) {
      if (child.isMesh) {
        cherryMesh.push(child);
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

let grape;
const grapeMesh = [];
loader.load(
  "/models/grape.gltf",
  function (gltf) {
    grape = gltf.scene;
    grape.scale.set(0.05, 0.04, 0.05);
    grape.position.set(0, 0.1, -4.5);
    scene.add(grape);

    // for raycasting
    grape.traverse(function (child) {
      if (child.isMesh) {
        grapeMesh.push(child);
      }
    });
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// add and receive shadows from all mesh objects
scene.traverse(function (node) {
  if (node.isMesh) {
    node.castShadow = true;
    node.receiveShadow = true;
  }
});

const clock = new THREE.Clock();
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const hoverLightSwitchText = document.createElement("div");
hoverLightSwitchText.style.position = "absolute";
hoverLightSwitchText.style.color = "white";
hoverLightSwitchText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
hoverLightSwitchText.style.padding = "5px";
hoverLightSwitchText.style.borderRadius = "5px";
hoverLightSwitchText.innerHTML = "Toggle Lights";
document.body.appendChild(hoverLightSwitchText);

const hoverFridgeText = document.createElement("div");
hoverFridgeText.style.position = "absolute";
hoverFridgeText.style.color = "white";
hoverFridgeText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
hoverFridgeText.style.padding = "5px";
hoverFridgeText.style.borderRadius = "5px";
document.body.appendChild(hoverFridgeText);

const hoverBananaText = document.createElement("div");
hoverBananaText.style.position = "absolute";
hoverBananaText.style.color = "white";
hoverBananaText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
hoverBananaText.style.padding = "5px";
hoverBananaText.style.borderRadius = "5px";
hoverBananaText.innerHTML = "Visit Banana";
document.body.appendChild(hoverBananaText);

const hoverCherryText = document.createElement("div");
hoverCherryText.style.position = "absolute";
hoverCherryText.style.color = "white";
hoverCherryText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
hoverCherryText.style.padding = "5px";
hoverCherryText.style.borderRadius = "5px";
hoverCherryText.innerHTML = "Visit Cherry";
document.body.appendChild(hoverCherryText);

const hoverGrapeText = document.createElement("div");
hoverGrapeText.style.position = "absolute";
hoverGrapeText.style.color = "white";
hoverGrapeText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
hoverGrapeText.style.padding = "5px";
hoverGrapeText.style.borderRadius = "5px";
hoverGrapeText.innerHTML = "Visit Grape";
document.body.appendChild(hoverGrapeText);

window.addEventListener("mousemove", (event) => {
  if (!lightSwitch || !fridge || !banana || !cherry || !grape) return; // return if objects not loaded

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const intersectsLightSwitch = raycaster.intersectObject(lightSwitch, true);
  const intersectsFridge = raycaster.intersectObject(fridge, true);
  const intersectsBanana = raycaster.intersectObject(banana, true);
  const intersectsCherry = raycaster.intersectObject(cherry, true);
  const intersectsGrape = raycaster.intersectObject(grape, true);

  if (intersectsLightSwitch.length > 0) {
    hoverLightSwitchText.style.left = event.clientX + "px";
    hoverLightSwitchText.style.top = event.clientY - 30 + "px"; // show above the cursor
    hoverLightSwitchText.style.display = "block";
  } else {
    hoverLightSwitchText.style.display = "none";
  }

  if (intersectsFridge.length > 0) {
    if (fridgeOpen) {
      hoverFridgeText.innerHTML = "Close Fridge";
    } else {
      hoverFridgeText.innerHTML = "Open Fridge";
    }
    hoverFridgeText.style.left = event.clientX + "px";
    hoverFridgeText.style.top = event.clientY - 30 + "px"; // show above the cursor
    hoverFridgeText.style.display = "block";
  } else {
    hoverFridgeText.style.display = "none";
  }

  if (intersectsBanana.length > 0 && fridgeOpen) {
    hoverBananaText.style.left = event.clientX + "px";
    hoverBananaText.style.top = event.clientY - 30 + "px"; // show above the cursor
    hoverBananaText.style.display = "block";
  } else {
    hoverBananaText.style.display = "none";
  }

  if (intersectsCherry.length > 0 && fridgeOpen) {
    hoverCherryText.style.left = event.clientX + "px";
    hoverCherryText.style.top = event.clientY - 30 + "px"; // show above the cursor
    hoverCherryText.style.display = "block";
  } else {
    hoverCherryText.style.display = "none";
  }

  if (intersectsGrape.length > 0 && fridgeOpen) {
    hoverGrapeText.style.left = event.clientX + "px";
    hoverGrapeText.style.top = event.clientY - 30 + "px"; // show above the cursor
    hoverGrapeText.style.display = "block";
  } else {
    hoverGrapeText.style.display = "none";
  }
});

window.addEventListener("click", (event) => {
  if (!lightSwitch || !fridge || !banana || !cherry || !grape) return; // return if objects not loaded

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
      camera.position.set(-5, 2.75, 7.5);
      camera.lookAt(0, 0, 0);
      animateIntensity(fridgeTopLight, 2, 0, 2000);
      animateIntensity(fridgeBottomLight, 2, 0, 2000);

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
          playCloseFridgeSfx();
        }, 1800);
      }
      fridgeOpen = false;
    } else if (fridgeActions.length > 0 && !fridgeOpen) {
      camera.position.set(0, 2, 0);
      camera.lookAt(0, 0, -10);

      animateIntensity(fridgeTopLight, 0, 2, 1000);
      animateIntensity(fridgeBottomLight, 0, 2, 1000);
      playOpenFridgeSfx();

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
  if (
    switchIntersect.length > 0 &&
    switchMesh.includes(switchIntersect[0].object)
  ) {
    // light switch clicked
    lightOn = !lightOn;
    playLightSwitchSfx();

    if (lightOn) {
      animateBackgroundColor(0x87ceeb, 0x070b34, 500);
      animateIntensity(sunLight, 1, 0, 500);
      animateIntensity(pointLight, 0, 50, 500);
    } else {
      animateBackgroundColor(0x070b34, 0x87ceeb, 500);
      animateIntensity(sunLight, 0, 1, 500);
      animateIntensity(pointLight, 50, 0, 500);
    }
  }

  const bananaIntersect = raycaster.intersectObject(banana, true);
  if (
    fridgeOpen &&
    bananaIntersect.length > 0 &&
    bananaMesh.includes(bananaIntersect[0].object)
  ) {
    // banana clicked
    window.location.replace("/pages/banana.html");
  }

  const cherryIntersect = raycaster.intersectObject(cherry, true);
  if (
    fridgeOpen &&
    cherryIntersect.length > 0 &&
    cherryMesh.includes(cherryIntersect[0].object)
  ) {
    // cherry clicked
    window.location.replace("/pages/cherry.html");
  }

  const grapeIntersect = raycaster.intersectObject(grape, true);
  if (
    fridgeOpen &&
    grapeIntersect.length > 0 &&
    grapeMesh.includes(grapeIntersect[0].object)
  ) {
    // grape clicked
    window.location.replace("/pages/grape.html");
  }
});

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

// toggle texture button
document.getElementById("btnRedecorate").addEventListener("click", function () {
  setTexture();
});

function playOpenFridgeSfx() {
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("sounds/open-fridge.wav", function (buffer) {
    sound.setBuffer(buffer);
    sound.setVolume(2);
    if (sound.isPlaying) {
      sound.stop(); // stop before replaying
    }
    sound.play();
  });
}

function playCloseFridgeSfx() {
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("sounds/close-fridge.wav", function (buffer) {
    sound.setBuffer(buffer);
    sound.setVolume(0.25);
    if (sound.isPlaying) {
      sound.stop(); // stop before replaying
    }
    sound.play();
  });
}

function playLightSwitchSfx() {
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("sounds/light-switch.wav", function (buffer) {
    sound.setBuffer(buffer);
    sound.setVolume(0.5);
    if (sound.isPlaying) {
      sound.stop(); // stop before replaying
    }
    sound.play();
  });
}

function getTexture(object, type) {
  return `textures/${currentTexture}/${object}/${type}.jpg`;
}

function setTexture() {
  // get next texture
  let currentIndex = textureList.indexOf(currentTexture);
  currentTexture = textureList[(currentIndex + 1) % textureList.length];

  // switch all required objects to the texture
  applyTextures(floor.material, "floor");
  applyTextures(backWall.material, "wall");
  applyTextures(rightWall.material, "wall");
  applyTextures(door.material, "door");
}

function applyTextures(material, object) {
  const diffuse = textureLoader.load(getTexture(object, "diffuse"));
  const normal = textureLoader.load(getTexture(object, "normal"));
  const roughness = textureLoader.load(getTexture(object, "roughness"));

  diffuse.wrapS = diffuse.wrapT = THREE.RepeatWrapping;
  diffuse.repeat.set(2, 2);
  normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
  normal.repeat.set(2, 2);
  roughness.wrapS = roughness.wrapT = THREE.RepeatWrapping;
  roughness.repeat.set(2, 2);

  material.map = diffuse;
  material.normalMap = normal;
  material.roughnessMap = roughness;
  material.needsUpdate = true;
}

function animateIntensity(light, from, to, duration = 1000) {
  const startTime = performance.now();

  function update() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    light.intensity = from + (to - from) * progress;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}

function animateBackgroundColor(fromColor, toColor, duration) {
  const start = performance.now();
  const colorFrom = new THREE.Color(fromColor);
  const colorTo = new THREE.Color(toColor);

  function update() {
    const elapsed = performance.now() - start;
    const progress = Math.min(elapsed / duration, 1);

    const currentColor = colorFrom.clone().lerp(colorTo, progress);
    renderer.setClearColor(currentColor);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function animate() {
  // update animations
  let delta = clock.getDelta();
  if (fridgeMixer) fridgeMixer.update(delta);
  // if (bananaMixer) bananaMixer.update(delta);
  // if (cherryMixer) cherryMixer.update(delta);
  // if (grapeMixer) grapeMixer.update(delta);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
