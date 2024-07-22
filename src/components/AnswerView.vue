<script setup>
import {onMounted, ref} from 'vue'
import axios from "axios";

const value = ref('')
const answers = ref('')

const fetchAnswers = async () => {
  try {
    const response = await axios.get('/answers.json'); // 这里使用相对路径
    answers.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

onMounted(fetchAnswers);

</script>

<template>
  <div>
    <el-row class="research-by-date" :gutter="20">
      <el-col :span="10">
              <div class="block">
                <el-date-picker
                    v-model="value"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    :size="size"
                />
              </div>
      </el-col>
      <el-col :span="2">
            <el-button type="primary" @click="research">検索</el-button>
      </el-col>
    </el-row>
  </div>
  <div class="answers">

  </div>
</template>

<style scoped>
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0 ;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
</style>