<template>
  <div>
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

    <el-table :data="questions" style="width: 100%">
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
import {ref} from 'vue';

const questions = ref([
  {id: 1, question: 'What is your name?'},
  {id: 2, question: 'How old are you?'},
  {id: 3, question: 'Where do you live?'}
]);

const newQuestion = ref({question: ''});

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
