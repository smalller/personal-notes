<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="login">登录</button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    async login() {
      const response = await fetch('/api/login', {
        method: 'get',
        // headers: {
        //   'Content-Type': 'application/json;charset=utf-8'
        // },
        // body: JSON.stringify({
        //   name: 'smalll'
        // })
      })
      if (response.ok) {
        console.log(response)
        const json = await response.json()
        console.log(json)
      }
    }
  },
}
</script>
