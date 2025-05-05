import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, bananaMixer, bananaAnimations, bananaActions;

let cutComplete = false;
let wireframeEnabled = false;

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

const container = document.getElementById("three-container");
container.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1.75, 2.25);
orbit.enablePan = false;
orbit.enableRotate = false;
orbit.enableZoom = false;
orbit.update();

// add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 0.75);
sunLight.position.set(-20, 5, 20);
sunLight.castShadow = true;
scene.add(sunLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(10, 10, 10);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 500;
scene.add(keyLight);

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
  "/models/banana_cut.glb",
  (gltf) => {
    banana = gltf.scene;
    banana.position.set(0, 0.75, 0.5);
    banana.scale.set(0.025, 0.025, 0.025);
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

    // for animations
    bananaMixer = new THREE.AnimationMixer(gltf.scene);
    bananaAnimations = gltf.animations;
    bananaActions = bananaAnimations.map((clip) =>
      bananaMixer.clipAction(clip)
    );
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

const hoverBananaText = document.createElement("div");
hoverBananaText.style.display = "none";
hoverBananaText.style.position = "absolute";
hoverBananaText.style.color = "white";
hoverBananaText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
hoverBananaText.style.padding = "5px";
hoverBananaText.style.borderRadius = "5px";
hoverBananaText.innerHTML = "Cut Open";
document.body.appendChild(hoverBananaText);

window.addEventListener("mousemove", (event) => {
  if (!banana || cutComplete) return; // return if object not loaded

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const intersectsBanana = raycaster.intersectObject(banana, true);

  function updateHoverTooltip(intersects, element) {
    if (intersects.length > 0) {
      element.style.left = event.clientX + "px";
      element.style.top = event.clientY - 30 + "px";
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  }

  updateHoverTooltip(intersectsBanana, hoverBananaText);
});

const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

window.addEventListener("click", (event) => {
  if (!banana || cutComplete) return; // return if object not loaded

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(bananaMesh, true);

  if (intersects.length > 0 && !cutComplete) {
    for (let action of bananaActions) {
      action.reset();
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.timeScale = 1;
      action.play();
    }
    cutComplete = true;
    hoverBananaText.style.display = "none";
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / (window.innerHeight * 0.8);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
});

document.getElementById("btnToggleWireframe").addEventListener("click", () => {
  wireframeEnabled = !wireframeEnabled;
  scene.traverse((object) => {
    if (object.isMesh) {
      object.material.wireframe = wireframeEnabled;
    }
  });
});

function animate() {
  // update animations
  let delta = clock.getDelta();
  if (bananaMixer) bananaMixer.update(delta);

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
