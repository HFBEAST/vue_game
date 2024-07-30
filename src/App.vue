<template>
  <div class="app-container">
    <SideNav />
    <div class="main-container">
        <router-view />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

const minWidth = 5000;
const minHeight = 600;

const resizeHandler = () => {
  if (window.innerWidth < minWidth || window.innerHeight < minHeight) {
    if (window.innerWidth < minWidth && window.innerHeight < minHeight) {
      window.resizeTo(minWidth, minHeight);
    } else if (window.innerWidth < minWidth) {
      window.resizeTo(minWidth, window.innerHeight);
    } else if (window.innerHeight < minHeight) {
      window.resizeTo(window.innerWidth, minHeight);
    }
  }
};

onMounted(() => {
  window.addEventListener('resize', resizeHandler);
  resizeHandler(); // Initial check
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler);
});
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
