<template>
  <div id="demo5">
    <canvas id="container"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";

export default {
  mounted() {
    function createGrass() {
      const geometry = new THREE.PlaneGeometry(10000, 10000);

      const texture = new THREE.TextureLoader().load("img/grass.jpg");
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(100, 100);

      const grassMaterial = new THREE.MeshBasicMaterial({ map: texture });

      const grass = new THREE.Mesh(geometry, grassMaterial);

      grass.rotation.x = -0.5 * Math.PI;

      scene.add(grass);
    }
  },
};
</script>

<style></style>
