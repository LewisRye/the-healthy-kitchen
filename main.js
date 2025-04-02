import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / (window.innerHeight), 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
const container = document.getElementById('three-container');
container.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const loader = new GLTFLoader();
loader.load( '/models/Banana.gltf', function ( gltf ) {
    console.log( gltf )
    scene.add( gltf.scene );
}, undefined, function ( error ) {
    console.error( error );
} );

camera.position.z = 150;

function animate() {
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

// a function that checks for window resize events
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight * 0.85;
    renderer.setSize( width, height );
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
