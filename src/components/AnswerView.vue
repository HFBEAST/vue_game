<template>
  <div>
    <el-row class="search-by-date" :gutter="20">
      <el-col :span="4">
      <el-button type="primary" @click="CSVDownload">
      <el-icon style="margin-right: 5px;"><Download /></el-icon>
      .CSV Download</el-button></el-col>
      <el-col :span="9">
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
      <el-table class="header-table"
          :data="filteredAnswers"
                style="width: 100%; max-height: 600px; height: 800px; overflow-y: auto; overflow-x: hidden;"
                :header-cell-style="{color: '#515151', fontSize: '12px', textAlign: 'center'}"
                :cell-style="{fontSize: '10px'}">
        <el-table-column prop="userid" label="ID" width="50"/>
        <el-table-column prop="file" label="ファイル名" width="100"/>
        <el-table-column prop="questno" label="questno" width="20"/>
        <el-table-column prop="quest" label="問題" width="100"/>
        <el-table-column prop="answer" label="回答" width="100"/>
        <el-table-column prop="excellent" label="excellent" width="20"/>
        <el-table-column prop="great" label="great" width="20"/>
        <el-table-column prop="good" label="good" width="20"/>
        <el-table-column prop="score" label="score" width="20"/>
        <el-table-column prop="morpheme" label="morpheme" width="100"/>
        <el-table-column prop="keys" label="keys" width="500"/>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
              <el-icon>
                <delete/>
              </el-icon>
              削除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {loadDataFromAWS} from "@/utils/ToAWS";
import {Delete} from "@element-plus/icons-vue";

const dateRange = ref([]);
const size = ref('medium');
const StartDate = ref(null);
const EndDate = ref(null);
const awsdata = ref([]);
const filteredAnswers = ref([]);

const fetchAWSData = () => {
  const url = 'https://o5ymi5rci6dobeyypagnu44zlq0fnnlf.lambda-url.ap-northeast-1.on.aws/';
  const requestData = {id: 'a', year: "2024", month: "07"};

  loadDataFromAWS(url, requestData, (error, data) => {
    if (error) {
      console.error("Error fetching or parsing data:", error);
      return;
    }
    awsdata.value = data; // 更新 awsdata 响应式变量
    filterAnswers();
  });
};

const handleSearch = () => {
  StartDate.value = new Date(dateRange.value[0]);
  EndDate.value = new Date(dateRange.value[1]);
  filterAnswers();
};

const filterAnswers = () => {
  if (!dateRange.value || dateRange.value.length !== 2) {
    filteredAnswers.value = awsdata.value; // 如果没有选择日期范围，显示所有内容
    return;
  }

  filteredAnswers.value = awsdata.value.filter(item => {
    const dateStr = item.file.slice(0, 8);
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    const formattedDate = `${year}-${month}-${day}`;
    return isDateInRange(formattedDate);
  });
};

const isDateInRange = (date) => {

  const [startDate, endDate] = dateRange.value.map(d => new Date(d).setHours(0, 0, 0, 0));
  const targetDate = new Date(date).setHours(0, 0, 0, 0);

  return targetDate >= startDate && targetDate <= endDate;
};



const CSVDownload = () => {
  const headers = Object.keys(awsdata.value[0]);
  const csvRows = [headers.join(',')];

  awsdata.value.forEach(question => {
    const values = headers.map(header => question[header]);
    csvRows.push(values.join(','));
  });

  const csvData = new Blob(['\uFEFF' + csvRows.join('\n')], {type: 'text/csv;charset=utf-8;'});
  const csvUrl = URL.createObjectURL(csvData);
  const a = document.createElement('a');
  a.setAttribute('href', csvUrl);
  a.setAttribute('download', 'awsdata.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

onMounted(fetchAWSData);
</script>

<style scoped>
.answers-container {
  max-height: 400px; /* 调整高度以适应您的布局 */
  margin-top: 10px;
}
</style>
