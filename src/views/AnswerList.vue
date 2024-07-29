<template>
  <div class="content">
    <HeaderNav title="解答一覧"/>
    <div class="main-content">
      <AnswerView/>
    </div>
  </div>
</template>

<script>

import {defineComponent} from "vue";
import AnswerView from "@/components/AnswerView.vue";

export default defineComponent({
  components: {AnswerView}
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
