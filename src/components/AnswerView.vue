<template>
  <div>
    <el-row class="search-by-date" :gutter="20">
      <el-col :span="10">
        <div class="block">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            :size="size"
          />
        </div>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="handleSearch">検索</el-button>
      </el-col>
    </el-row>
    <div class="answers-container">
      <el-table :data="filteredAnswers" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column label="日付" width="200">
          <template #default="scope">
            {{ scope.row.year }}-{{ scope.row.month }}-{{ scope.row.day }}
          </template>
        </el-table-column>
        <el-table-column prop="answer" label="内容"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const dateRange = ref([]);
const size = ref('medium');
const StartDate = ref(null);
const EndDate = ref(null);
const answers = ref([]);
const filteredAnswers = ref([]);

const isDateInRange = (date) => {
  if (!dateRange.value || dateRange.value.length !== 2) {
    return true; // 如果没有选择日期范围，显示所有内容
  }

  const [startDate, endDate] = dateRange.value.map(d => new Date(d).setHours(0, 0, 0, 0));
  const targetDate = new Date(date).setHours(0, 0, 0, 0);

  return targetDate >= startDate && targetDate <= endDate;
};

const fetchAnswers = async () => {
  try {
    const response = await axios.get('/answers.json'); // 这里使用相对路径
    answers.value = response.data.data;
    filterAnswers();
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const filterAnswers = () => {
  filteredAnswers.value = answers.value.filter(answer => {
    const formattedDate = `${answer.year}-${answer.month}-${answer.day}`;
    return isDateInRange(formattedDate);
  });
};

const handleSearch = () => {
  StartDate.value = new Date(dateRange.value[0]);
  EndDate.value = new Date(dateRange.value[1]);
  filterAnswers();
};

onMounted(fetchAnswers);
</script>

<style scoped>
.answers-container {
  max-height: 400px; /* 调整高度以适应您的布局 */
  overflow-y: auto; /* 垂直滚动条 */
}
</style>
