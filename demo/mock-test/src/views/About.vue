<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
import { getUserInfo } from "@/api/user.js";

export default {
  data() {
    return {};
  },

  methods: {},

  created() {
    getUserInfo()
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
