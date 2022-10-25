import './style.css';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { SelectiveBloomEffect, EffectComposer, EffectPass, RenderPass, BlendFunction, ShaderPass } from 'postprocessing';

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

// Orbit Controls
const controls = new OrbitControls( camera, renderer.domElement );

//
//		BLOOM EFFECT
//

const effect = new SelectiveBloomEffect(scene, camera, {
	blendFunction: BlendFunction.ADD,
	mipmapBlur: true,
	luminanceThreshold: 0.7,
	luminanceSmoothing: 0.3,
	intensity: 30.0,
	inverted: false
});

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new EffectPass(camera, effect));
composer.multisampling = 32;

//
//    MODEL LOADER
//

const loader = new GLTFLoader();

let glow;
loader.load('https://drive.google.com/file/d/1HjA9L8x-N3eVE-pmJzQ2WshrX2-cFOMs/view?usp=sharing', function (gltf) {
		scene.add( gltf.scene );
	},
	function ( xhr ) {}, // loading
	function ( error ) { console.log( error ); } // error loading
);
loader.load('https://drive.google.com/file/d/1T6KVnQOJivjVu4aa7SvM2m8eP2xp-asS/view?usp=sharing', function (gltf) {
		glow = gltf.scene;
		scene.add( gltf.scene );
  },
  function ( xhr ) {}, // loading
  function ( error ) { console.log( error ); } // error loading
);

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
	if (counter > 50) counter = 0;
	if (counter == 50) {
		if (glow) {
			effect.selection.toggle(glow);
			console.log('toggled.');
		}
	}
});