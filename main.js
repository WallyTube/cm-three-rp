import './style.css';
import * as THREE from 'three';
//import Color from './color.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { EffectComposer, RenderPass, ShaderPass, EffectPass } from 'postprocessing';

//
//    INIT
//

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
const camera = new THREE.PerspectiveCamera(4, innerWidth / innerHeight, 1, 1000);

renderer.setClearColor( 0x000000, 0 );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.x = -40;
camera.position.y = 27;
camera.position.z = 235;

// Better Lighting
const pmremGenerator = new THREE.PMREMGenerator( renderer );
scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;



const controls = new OrbitControls( camera, renderer.domElement );

//
//		BLOOM EFFECT
//

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.multisampling = 32;

//
//    MODEL LOADER
//

const loader = new GLTFLoader();

let glow;
let y;
loader.load('./resources/models/computer.gltf', function (gltf) {
		scene.add( gltf.scene );
	},
	function ( xhr ) {}, // loading
	function ( error ) { console.log( error ); } // error loading
);
loader.load('./resources/models/computer_glow.gltf', function (gltf) {
		glow = gltf.scene;
		scene.add( gltf.scene );
	},
	function ( xhr ) {}, // loading
	function ( error ) { console.log( error ); } // error loading
);
loader.load('./resources/models/y.gltf', function (gltf) {
	y = gltf.scene;
	scene.add( gltf.scene );
	gltf.scene.traverse(o => {
		if (o.isMesh) o.material = new THREE.MeshStandardMaterial({color: 0xff0000, wireframe: true});
	});
	gltf.scene.position.x += 4;
},
function ( xhr ) {}, // loading
function ( error ) { console.log( error ); } // error loading
);
loader.load('./resources/models/a.gltf', function (gltf) {
	y = gltf.scene;
	scene.add( gltf.scene );
	gltf.scene.traverse(o => {
		if (o.isMesh) o.material = new THREE.MeshStandardMaterial({color: 0x00ff00, wireframe: false});
	});
	gltf.scene.position.x += 7.5;
},
function ( xhr ) {}, // loading
function ( error ) { console.log( error ); } // error loading
);
loader.load('./resources/models/n.gltf', function (gltf) {
	y = gltf.scene;
	scene.add( gltf.scene );
	gltf.scene.traverse(o => {
		if (o.isMesh) o.material = new THREE.MeshStandardMaterial({color: 0xff0000, wireframe: true});
	});
	gltf.scene.position.x += 11.5;
},
function ( xhr ) {}, // loading
function ( error ) { console.log( error ); } // error loading
);

//
//		CLOCKING
//

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
})

let counter = 0;
requestAnimationFrame(function render() {
	controls.update();
	composer.render();
	requestAnimationFrame(render);

	counter++;
	y.traverse(o => {
		if (o.isMesh) o.material = new THREE.MeshStandardMaterial({color: changeHue('0xff0000', counter), wireframe: true});
	});
});