<template>
  <div>
    <el-button type="primary" @click="CSVDownload">
      <el-icon style="margin-right: 5px;"><Download /></el-icon>
      .CSV Download</el-button>
    <el-row class="add-question" :gutter="20">
      <el-col :span="22">
        <el-form :model="newQuestion">
          <el-form-item>
            <el-input v-model="newQuestion.question" placeholder="New Question"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2">
        <el-form :model="newQuestion">
          <el-form-item>
            <el-button type="primary" @click="handleAdd">登陆</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

      <el-table :data="questions" style="width: 100%; height: 400px">
        <el-table-column prop="id" label="ID" width="50"></el-table-column>
        <el-table-column prop="question" label="Question" width="auto">
          <template #default="scope">
            <div class="content-cell">{{ scope.row.question }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {loadDataFromAWS} from '@/utils/ToAWS'; // 确保导入路径正确

const questions = ref(null);

const fetchAWSData = () => {
  const url = 'https://o5ymi5rci6dobeyypagnu44zlq0fnnlf.lambda-url.ap-northeast-1.on.aws/';
  const requestData = {id: 'q'};

  loadDataFromAWS(url, requestData, (error, data) => {
    if (error) {
      console.error("Error fetching or parsing data:", error);
      return;
    }
    questions.value = data; // 更新 awsdata 响应式变量
    console.log(data);
  });
};

const newQuestion = ref({question: ''});

const CSVDownload = () => {
  const headers = Object.keys(questions.value[0]);
  const csvRows = [headers.join(',')];

  questions.value.forEach(question => {
    const values = headers.map(header => question[header]);
    csvRows.push(values.join(','));
  });

  const csvData = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const csvUrl = URL.createObjectURL(csvData);
  const a = document.createElement('a');
  a.setAttribute('href', csvUrl);
  a.setAttribute('download', 'questions.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const handleAdd = () => {
  if (newQuestion.value.question.trim()) {
    questions.value.push({
      id: questions.value.length ? questions.value[questions.value.length - 1].id + 1 : 1,
      question: newQuestion.value.question,
    });
    newQuestion.value.question = '';
  } else {
    console.warn('Question input is empty.');
  }
};

const handleDelete = (index, id) => {
  questions.value = questions.value.filter((q) => q.id !== id).map((q, i) => ({...q, id: i + 1}));
};

onMounted(fetchAWSData); // 在组件挂载时调用 fetchAWSData 函数

</script>

<style scoped>
.header-cell {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

.content-cell {
  font-size: 12px;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
}

.el-button {
  margin-right: 10px;
}

.add-question {
  margin-top: 20px;
}

</style>
