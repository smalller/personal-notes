<template>
  <div id="demo2"></div>
</template>

<script>
import * as THREE from 'three';

export default {
  mounted() {
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('demo2').appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    // 定义一个材质。对于线条来说，我们能使用的材质只有LineBasicMaterial 或者 LineDashedMaterial。
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // 定义三个几何点
    // 线是画在每一对连续的顶点之间的，而不是在第一个顶点和最后一个顶点之间绘制线条（线条并未闭合）
    const points = [];
    points.push(new THREE.Vector3(- 10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // 将两条线和一个材质组合在一起，形参一条线
    const line = new THREE.Line(geometry, material);

    // 将这条线添加到场景中
    scene.add(line);

    // 渲染
    renderer.render(scene, camera);

  }
}
</script>

<style>
</style>