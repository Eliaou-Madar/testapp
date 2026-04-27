import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js';
import { ARButton } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/webxr/ARButton.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/loaders/GLTFLoader.js';

let camera, scene, renderer;
let controller;

init();

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;

  document.body.appendChild(renderer.domElement);

  // Bouton AR
  const button = ARButton.createButton(renderer, {
    requiredFeatures: ['hit-test']
  });

  document.getElementById("startAR").onclick = () => {
    document.body.appendChild(button);
    button.click();
  };

  // Lumière
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // Charger modèle 3D
  const loader = new GLTFLoader();
  loader.load('./assets/model.glb', function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(0, 0, -1);
    scene.add(model);
  });

  renderer.setAnimationLoop(render);
}

function render() {
  renderer.render(scene, camera);
}