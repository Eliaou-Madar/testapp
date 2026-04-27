import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js';
import { ARButton } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/webxr/ARButton.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/loaders/GLTFLoader.js';

const debug = document.getElementById("debug");

function log(msg) {
  debug.innerHTML += msg + "<br>";
  console.log(msg);
}

log("🚀 Script chargé");

let camera, scene, renderer;

init();

function init() {

  if (!navigator.xr) {
    log("❌ WebXR NON supporté → fallback activé");
    fallbackMode();
    return;
  }

  log("✅ WebXR dispo");

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;

  document.body.appendChild(renderer.domElement);

  log("🎥 Renderer OK");

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // charger modèle
  const loader = new GLTFLoader();

  loader.load(
    './assets/model.glb',
    (gltf) => {
      log("✅ Modèle chargé");

      const model = gltf.scene;
      model.scale.set(0.3, 0.3, 0.3);
      model.position.set(0, 0, -1);

      scene.add(model);
    },
    undefined,
    (error) => {
      log("❌ erreur modèle");
    }
  );

  const arButton = ARButton.createButton(renderer, {
    optionalFeatures: ['hit-test']
  });

  document.body.appendChild(arButton);
  arButton.style.display = "none";

  document.getElementById("startAR").onclick = async () => {

    log("👉 bouton cliqué");

    const supported = await navigator.xr.isSessionSupported("immersive-ar");

    if (!supported) {
      log("❌ AR non supporté → fallback");
      fallbackMode();
      return;
    }

    log("✅ lancement AR");

    arButton.style.display = "block";
    arButton.click();
  };

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}

// -------- FALLBACK --------
function fallbackMode() {
  document.getElementById("fallback").style.display = "block";
  log("📱 mode fallback activé (model-viewer)");
}