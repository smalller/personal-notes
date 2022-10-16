<template>
  <div id="demo3">
    <canvas id="container"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  mounted() {
    // 创建容渲染器方式一（基于canvas标签）
    const canvas = document.querySelector("#container");
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 创建容渲染器方式二（基于普通标签）
    // const canvas = document.getElementById('demo3')
    // const renderer = new THREE.WebGLRenderer();
    // canvas.appendChild(renderer.domElement);
    // renderer.setSize(window.innerWidth, window.innerHeight);

    // 创建场景
    const scene = new THREE.Scene();
    // 设置场景背景
    scene.background = new THREE.Color("pink");

    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // 遥控器（鼠标控制转动，缩放）
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    // 环境光
    {
      const skyColor = 0xb1e1ff;
      const groundColor = 0xb97a20;
      const intensity = 1;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      scene.add(light);
    }

    // 平行光
    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(5, 10, 2);
      scene.add(light);
      scene.add(light.target);
    }

    // 载入3D模型
    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load("/models/gltf2/scene.gltf", (gltf) => {
        scene.add(gltf.scene);
      });
    }

    // 渲染
    function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    render();
  },
};
</script>

<style></style>
