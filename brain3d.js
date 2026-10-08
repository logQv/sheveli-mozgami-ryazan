import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

(function () {
  const container = document.getElementById('brain-3d');
  if (!container) {
    console.error('Не найден элемент #brain-3d');
    return;
  }

  // Сцена
  const scene = new THREE.Scene();
  scene.background = null;

  // Камера
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);

  // Рендер
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Свет
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));

  const frontLight = new THREE.DirectionalLight(0xffffff, 1.5);
  frontLight.position.set(5, 5, 5);
  scene.add(frontLight);

  const backLight = new THREE.DirectionalLight(0x4ab8e0, 0.8);
  backLight.position.set(-5, -3, -5);
  scene.add(backLight);

  // Управление мышью
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 12;

  // Загрузка модели
  const loader = new GLTFLoader();
  loader.load(
    'brain_hologram.glb',
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(2, 2, 2);
      model.position.set(0, 0, 0);
      scene.add(model);
      console.log('✅ Модель загружена');
    },
    (progress) => {
      if (progress.total > 0) {
        console.log('Загрузка:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
      }
    },
    (error) => {
      console.error('❌ Ошибка загрузки модели:', error);
      container.innerHTML = '<p style="color:#7fa0c0;padding:40px;text-align:center;">Не удалось загрузить модель.</p>';
    }
  );

  // Ресайз
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Анимация
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
})();
