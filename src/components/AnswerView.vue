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
                border resizable
                :data="filteredAnswers"
                style="width: 100%; max-height: 600px; height: 800px; overflow-y: auto; overflow-x: hidden;"
                :header-cell-style="{color: '#515151', fontSize: '12px', textAlign: 'center'}"
                :cell-style="{fontSize: '10px'}">
<!--
                <el-table-column label="keys" type="expand" width="70">
          <template v-slot="props">
            <p>{{ props.row.keys }}</p>
          </template>
        </el-table-column>
-->
        <el-table-column prop="userid" label="ID" width="100"/>
        <el-table-column prop="file" label="日時" width="100"/>
        <el-table-column prop="questno" label="問題番号" width="50"/>
        <el-table-column prop="quest" label="問題" width="300"/>
        <el-table-column class="answer" prop="answer" label="解答" width="300"/>
        <el-table-column prop="excellent" label="excellent" width="90"/>
        <el-table-column prop="great" label="great" width="60"/>
        <el-table-column prop="good" label="good" width="60"/>
        <el-table-column prop="score" label="score" width="60"/>

        <el-table-column label="解答形態素" width="90">
          <template #default="scope">
            <el-popover effect="light" trigger="hover" placement="left" width="auto">
              <template #default>
                <div class="popup">{{ scope.row.morpheme }}</div>
              </template>
              <template #reference>
                <el-tag>表示</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="キー入力" width="80">
          <template #default="scope">
            <el-popover effect="light" trigger="hover" placement="left" width="auto">
              <template #default>
                <div class="popup">{{ scope.row.keys }}</div>
              </template>
              <template #reference>
                <el-tag>表示</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import {loadDataFromAWS} from "@/utils/ToAWS";
//import {Delete} from "@element-plus/icons-vue";
import _ from 'lodash';

const dateRange = ref([]);
const size = ref('');
const StartDate = ref(null);
const EndDate = ref(null);
const awsdata = ref([]);
const filteredAnswers = ref([]);
let copyAnswers = ref([]);

const fetchAWSData = () => {
  const url = 'https://o5ymi5rci6dobeyypagnu44zlq0fnnlf.lambda-url.ap-northeast-1.on.aws/';
  const requestData = {id: 'a', start: "2024-05-01", end: "2024-07-29"};

  loadDataFromAWS(url, requestData, (error, data) => {
    if (error) {
      console.error("Error fetching or parsing data:", error);
      return;
    }
    awsdata.value = data; // 更新 awsdata 响应式变量
    copyAnswers = _.cloneDeep(awsdata)
    awsdata.value.forEach(item => {
        const dateStr = item.file.slice(0, 14);
        const year = dateStr.slice(0, 4);
        const month = dateStr.slice(4, 6);
        const day = dateStr.slice(6, 8);
        const hour = dateStr.slice(8, 10);
        const minute = dateStr.slice(10, 12);
        const second = dateStr.slice(12, 14);
        const formattedDate = `${year}/${month}/${day} ${hour}:${minute}:${second}`;
        item.file = formattedDate;
        item.answer = item.answer.replaceAll('|', '\n');
        item.morpheme = item.morpheme.replaceAll('|', '\n');
        item.keys = item.keys.replaceAll('"', '');
        item.keys = item.keys.replaceAll('|', '\n');
    });
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
  const headers = Object.keys(copyAnswers.value[0]);
  const csvRows = [headers.join(',')];

  copyAnswers.value.forEach(question => {
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
<style>

.el-table .cell {
  white-space: pre-line;
}
.popup {
  font-size: 10px;
  white-space: pre-line;
  height:300px;
  overflow-y: scroll;
}
</style>