(function () {
  const container = document.getElementById('brain-3d');
  if (!container) return;

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
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const frontLight = new THREE.DirectionalLight(0xffffff, 1.5);
  frontLight.position.set(5, 5, 5);
  scene.add(frontLight);

  const backLight = new THREE.DirectionalLight(0x4ab8e0, 0.8);
  backLight.position.set(-5, -3, -5);
  scene.add(backLight);

  // Управление мышью
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 12;

  // Загрузка модели
  const loader = new THREE.GLTFLoader();
  loader.load(
    'brain_hologram.glb',
    (gltf) => {
      const model = gltf.scene;

      // Подгоняем размер под сцену
      // Если модель слишком большая/маленькая — меняй это число
      model.scale.set(2, 2, 2);

      // Центрируем
      model.position.set(0, 0, 0);

      scene.add(model);
      console.log('Модель загружена:', model);
    },
    (progress) => {
      console.log('Загрузка:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
    },
    (error) => {
      console.error('Ошибка загрузки модели:', error);
      container.innerHTML = '<p style="color:#7fa0c0;padding:40px;text-align:center;">Не удалось загрузить 3D-модель.</p>';
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
