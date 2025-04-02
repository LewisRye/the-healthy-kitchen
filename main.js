import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / (window.innerHeight), 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
const container = document.getElementById('three-container');
container.appendChild( renderer.domElement );

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

let banana;
let cherry;
let grape;

const loader = new GLTFLoader();
loader.load( '/models/Banana.gltf', function ( gltf ) {
    banana = gltf.scene;
    scene.add( banana );
}, undefined, function ( error ) {
    console.error( error );
} );
loader.load( '/models/Cherry.gltf', function ( gltf ) {
    cherry = gltf.scene;
    cherry.scale.set(15, 15, 15);
    cherry.position.set(-90, 0, 0);
    scene.add( cherry );
}, undefined, function ( error ) {
    console.error( error );
} );
loader.load( '/models/Grape.gltf', function ( gltf ) {
    grape = gltf.scene;
    grape.scale.set(10, 10, 10);
    grape.position.set(90, 0, 0);
    scene.add( grape );
}, undefined, function ( error ) {
    console.error( error );
} );

camera.position.z = 150;

function animate() {
    if (banana) {
        banana.rotation.y += 0.01;
    }
    if (cherry) {
        cherry.rotation.y += 0.01;
    }
    if (grape) {
        grape.rotation.y += 0.01;
    }
    
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

// a function that checks for window resize events
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize( width, height );
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
