import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js';
import { ARButton } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/webxr/ARButton.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/loaders/GLTFLoader.js';

const debugDiv = document.getElementById("debug");

function log(msg) {
  console.log(msg);
  debugDiv.innerHTML += msg + "<br>";
}

// -------- DEBUG DE BASE --------
log("🚀 Script chargé");

let camera, scene, renderer;

init();

function init() {

  log("Init...");

  // Vérif WebXR
  if (!navigator.xr) {
    log("❌ WebXR NON supporté");
    return;
  } else {
    log("✅ WebXR dispo");
  }

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;

  document.body.appendChild(renderer.domElement);

  log("🎥 Renderer OK");

  // Lumière
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // -------- CHARGEMENT MODELE --------
  const loader = new GLTFLoader();

  log("📦 Chargement modèle...");

  loader.load(
    './assets/model.glb',
    function (gltf) {
      log("✅ Modèle chargé");

      const model = gltf.scene;
      model.scale.set(0.3, 0.3, 0.3);
      model.position.set(0, 0, -1);

      scene.add(model);
    },
    undefined,
    function (error) {
      log("❌ ERREUR modèle: " + error.message);
    }
  );

  // -------- BOUTON AR --------
  const arButton = ARButton.createButton(renderer, {
    optionalFeatures: ['hit-test']
  });

  document.body.appendChild(arButton);
  arButton.style.display = "none";

  document.getElementById("startAR").addEventListener("click", async () => {

    log("👉 Click bouton");

    const supported = await navigator.xr.isSessionSupported("immersive-ar");

    if (!supported) {
      log("❌ AR non supporté");
      alert("AR non supporté");
      return;
    }

    log("✅ AR supporté → lancement");

    arButton.style.display = "block";
    arButton.click();
  });

  renderer.setAnimationLoop(render);
}

// -------- RENDER --------
function render() {
  renderer.render(scene, camera);
}