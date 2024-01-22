/*
  To get started:
  - only the first time on the command line run:
      npm install 
  - Every time you develop / test (look at package.json to change port for static server):
      npm run dev
  - To build your static site:
      npm run build
  - To preview a static site / build, after you have run the above command:
      npm run preview
*/

//import three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';//camera controls
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';//Dat Gui
import Stats from 'three/examples/jsm/libs/stats.module';//frame rate and other stats

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { loadGltfs } from './loadGltfs.js';
const manager = new THREE.LoadingManager(); // loading manager - https://threejs.org/docs/#api/en/loaders/managers/LoadingManager

let filesToLoad = 0; // number of files to load

let scene, camera, renderer, controls;//we can declare variables on one line like this
let light, dirLight;

manager.onStart = function (url, itemsLoaded, itemsTotal) {
  filesToLoad = itemsTotal; // set the total number of files to load
  console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
  filesToLoad = itemsTotal; // set the total number of files to load
  console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  console.log(Math.round((itemsLoaded / filesToLoad) * 100))

  document.getElementById("load-progress").innerHTML = Math.round((itemsLoaded / filesToLoad) * 100) + "% Loaded"
};
manager.onLoad = function () {
  console.log('Loading complete!');
  setTimeout(function () { document.getElementById("loading").classList.add("hidden"); }, 1000);
  // document.getElementById("loading").classList.add("hidden");
};
manager.onError = function (url) {
  console.log('There was an error loading ' + url);
};

//helpers
let gui, stats, gridHelper;

let models = {};

async function preload() {
  models = await loadGltfs(manager);
  console.log('end of preload');

}

function init() {
  console.log('start of init');

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // camera user interaction controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  //set up our scene
  // ambient light (from all around)
  light = new THREE.AmbientLight(0xfffafe); // soft white light
  scene.add(light);

  //directional light
  dirLight = new THREE.DirectionalLight(0xffffff, 3);
  dirLight.position.set(- 1, 1.75, 1);//angle the light
  dirLight.position.multiplyScalar(20);// move it back... or do it in one line
  scene.add(dirLight);
  //see where your directional light is
  // const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
  // scene.add( dirLightHelper );


  gui = new GUI({ name: 'My GUI' });

  //Put your glb files (all static assets) in the public folder
  new GLTFLoader()
    .setPath('models/')
    .load('SheenChair.glb', function (gltf) {

      // scene.add( gltf.scene );

      const object = gltf.scene.getObjectByName('SheenChair_fabric');

      gui.add(object.material, 'sheen', 0, 1);
      gui.open();

    });

  // add loaded models to scene
  for (let mod in models) {
    scene.add(models[mod].scene);
  }


  gridHelper = new THREE.GridHelper(40, 40);
  scene.add(gridHelper);

  //For frame rate etc
  stats = Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)

  //add event listener, when window is resized call onWindowResize callback
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('keydown', onKeyDown);
  //https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
  //https://www.w3schools.com/js/js_htmldom_eventlistener.asp
  //https://www.w3schools.com/js/js_htmldom_events.asp
}

function animate() {
  requestAnimationFrame(animate);//manually call request next animation frame

  //render the scene
  renderer.render(scene, camera);

  //update stats
  stats.update();
}

//initialize then call animation loop
await preload();
init();
animate();

function onWindowResize() {
  //resize everything on Window Resize
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

}

function onKeyDown(event) {

  // console.log(event.key);//https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
  if (event.key === "d") {
    //show hide the dat gui panel
    if (gui._hidden) {
      gui.show();
    } else {
      gui.hide();
    }
  }

};
