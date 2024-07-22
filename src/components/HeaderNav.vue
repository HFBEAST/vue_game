<template>
  <header class="header-nav">
    <h1>{{ title }}</h1>
  </header>
</template>

<script>
export default {
  name: 'HeaderNav',
  props: {
    title: {
      type: String,
      default: 'Dashboard'
    }
  }
}
</script>

<style scoped>
.header-nav {
  background-color: #3498db;
  color: white;
  text-align: center;
  top: 0;
  left: 200px;
  width: 100%;
  height: 100px;
  z-index: 1000;
}

.header-nav h1 {
  line-height: 100px;
  margin: 0;
}
</style>
