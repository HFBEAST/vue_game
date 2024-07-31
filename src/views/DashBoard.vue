<template>
  <div class="content">
    <HeaderNav title="ダッシュボード"/>
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
  width: calc(100%);
}

.main-content {
  display: flex;
  padding: 20px;
}
</style>
