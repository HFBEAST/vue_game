<template>
  <div class="content">
    <HeaderNav title="Dashboard"/>
    <div class="main-content">
      <ChartList/>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import ChartList from "@/components/ChartList.vue";

export default defineComponent({
  components: {ChartList}
})

</script>

<style scoped>
.content {
height: 100vh;
  width: 100%;
}

.main-content {
  padding: 20px;
}
</style>
