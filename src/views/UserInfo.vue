<template>
  <div class="container">
    <HeaderNav title="UserInfo"/>
    <div class="content-container">
      <h2>UserInfo Content</h2>
      <p>This is the UserInfo page.</p>
      <UserTable />
    </div>
  </div>
</template>

<script>

import {defineComponent} from "vue";
import UserTable from "@/components/UserTable.vue";

export default defineComponent({
  components: {UserTable}
})
</script>

<style scoped>
.container {
height: 100%;
  width: 100%;
}

.content-container{

  margin: 20px;
  background-color: #f7f8f9;
}
</style>
