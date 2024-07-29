<template>
  <div class="content">
    <HeaderNav title="問題一覧"/>
    <div class="main-content">
      <CreateQuestion/>
    </div>
  </div>
</template>

<script>

import {defineComponent} from "vue";
import CreateQuestion from "@/components/CreateQuestion.vue";

export default defineComponent({
  components: {CreateQuestion}
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
