<template>
  <div class="app-container">
    <SideNav />
    <div class="main-container">
        <router-view />
    </div>
  </div>
</template>

<script>

</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.main-container {
  display: flex;
  flex-direction: column;
  background-color: #f7f8f9;
  height: 100vh;
  width: calc(100vw - 200px);
  overflow: hidden;
}

router-view {
  flex: 1;
}
</style>
