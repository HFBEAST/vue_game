<template>
  <div class="content">
    <HeaderNav title="QuestionList"/>
    <div class="main-content">
      <h2>QuestionList Content</h2>
      <p>This is the QuestionList page.</p>
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
