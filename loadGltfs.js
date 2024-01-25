import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

async function loadGltfs(_manager) {
  const loader = new GLTFLoader(_manager);//pass in our loading manager

  //add a variable name for each object in order of the files
  const [
    armChairGltf, carpetGltf, iridiscenceLampGltf,
     sheenchairGltf
  ] = await Promise.all([
    loader.loadAsync('models/armchair.glb'),
    loader.loadAsync('models/carpet.glb'),
    loader.loadAsync('models/IridescenceLamp.glb'),
    loader.loadAsync('models/SheenChair.glb')
  ]);

  return {
    armChairGltf, carpetGltf, iridiscenceLampGltf, sheenchairGltf
  };
}

export { loadGltfs };