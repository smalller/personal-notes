<template>
  <div id="demo1"></div>
</template>

<script>
import * as THREE from 'three';

export default {
  mounted() {
    //创建一个场景
    const scene = new THREE.Scene();

    /**
     * 创建相机，此处为透视摄像机
     * 相机的作用就是：透过相机渲染出场景
     * 参数一：视野角度（FOV）。视野角度就是无论在什么时候，你所能在显示器上看到的场景的范围，它的单位是角度(与弧度区分开)。
     * 参数二：长宽比（aspect ratio）。 也就是你用一个物体的宽除以它的高的值。
     * 参数三：近截面（near）
     * 参数四：远截面（far）
     * 物体某些部分比摄像机的远截面远或者比近截面近的时候，该这些部分将不会被渲染到场景中。
    */
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


    // 创建渲染器
    const renderer = new THREE.WebGLRenderer();

    // 设置渲染器的尺寸（宽高）
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 将renderer（渲染器）的dom元素（renderer.domElement）添加到我们的HTML文档中
    // document.body.appendChild(renderer.domElement);
    document.getElementById('demo1').appendChild(renderer.domElement);


    // 创建一个立方体
    const geometry = new THREE.BoxGeometry();

    // 设置一个材质，让他拥有颜色
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });

    // 创建一个Mesh（网格）。 网格包含一个几何体以及作用在此几何体上的材质，我们可以直接将网格对象放入到我们的场景中，并让它在场景中自由移动。
    const cube = new THREE.Mesh(geometry, material);

    // 默认情况下，当我们调用scene.add()的时候，物体将会被添加到(0,0,0)坐标。
    // 但将使得摄像机和立方体彼此在一起。为了防止这种情况的发生，我们只需要将摄像机稍微向外移动一些即可。
    scene.add(cube);
    camera.position.z = 5;


    // 渲染循环，让立方体动起来
    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    }
    animate();
  }
}
</script>

<style>
</style>