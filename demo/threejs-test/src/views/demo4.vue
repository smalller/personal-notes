<template>
  <div id="demo4">
    <canvas id="container"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


export default {
  mounted() {
    function main() {
      const canvas = document.querySelector("#container");
      // 容器
      const renderer = new THREE.WebGLRenderer({
        canvas
      });
      // 场景
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("pink");
      // 照相机
      const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
      // camera.position.set(0, 10, 20);
      // 遥控器（鼠标控制转动，缩放）
      const controls = new OrbitControls(camera, canvas);
      controls.target.set(0, 5, 0);
      controls.update();
      // 环境光
      {
        const skyColor = 0xB1E1FF;
        const groundColor = 0xB97A20;
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
      }
      // 平行光
      {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(5, 10, 2);
        scene.add(light);
        scene.add(light.target);
      }
      let cars; // 
      // 加载gltf
      {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
          "https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf",
          (gltf) => {
            const root = gltf.scene;
            scene.add(root);


            // 打印所有的模型
            console.log(dumpObject(root).join('\n'));
            cars = root.getObjectByName("Cars"); // 获取所有的小汽车对象
            // 转换为3d box
            const box = new THREE.Box3().setFromObject(root);
            // 获取盒子大小及盒子中心点
            const boxSize = box.getSize(new THREE.Vector3()).length();
            const boxCenter = box.getCenter(new THREE.Vector3());
            // 设置照相机机位 
            frameArea(boxSize * 0.5, boxSize, boxCenter, camera);
            // 设置控制中心点
            controls.maxDistance = boxSize * 10;
            controls.target.copy(boxCenter);
            controls.update();
          })
      }

      // 可以原封不动的使用于各种模型
      function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
        const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
        // 将镜头视角转换为弧度
        const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
        const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

        const direction = (new THREE.Vector3())
          .subVectors(camera.position, boxCenter)
          .multiply(new THREE.Vector3(1, 0, 1))
          .normalize();
        camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
        // 近端面
        camera.near = boxSize / 100;
        // 远端面
        camera.far = boxSize * 100;
        // 生效配置
        camera.updateProjectionMatrix();
        camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
      }

      // 可以原封不动的使用于各种模型
      function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }

      function render(time) {
        time *= 0.001; // 转换为秒

        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }

        if (cars) {
          for (const car of cars.children) {
            // 让小汽车沿着Y轴旋转
            car.rotation.y = time;
          }
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
      render();
    }
    main();

    // 获取模型中所有的模型
    function dumpObject(obj, lines = [], isLast = true, prefix = '') {
      const localPrefix = isLast ? '└─' : '├─';
      lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
      const newPrefix = prefix + (isLast ? '  ' : '│ ');
      const lastNdx = obj.children.length - 1;
      obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObject(child, lines, isLast, newPrefix);
      });
      return lines;
    }

  }
}
</script>

<style>
</style>