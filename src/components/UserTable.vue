<template>
  <div class="content">
    <el-table
        :data="users"
        style="width: 100%"
        :header-cell-style="{color: '#515151', fontSize: '12px', textAlign: 'center'}"
        :cell-style="{fontSize: '10px'}"
    >
      <el-table-column prop="userid" label="ID" width="50"/>
      <el-table-column prop="Age" label="年齢" width="50"/>
      <el-table-column prop="Gender" label="性別" width="80"/>
      <el-table-column prop="Blood type" label="血液型" width="60"/>
      <el-table-column prop="Educational background (Highest education)" label="経歴（最終学歴）" width="120"/>
      <el-table-column prop="Major/Field of study" label="学科" width="120"/>
      <el-table-column prop="Occupation" label="職業" width="120"/>
      <el-table-column prop="Department" label="部署" width="120"/>
      <el-table-column prop="Position (job title)" label="役職（職位）" width="120"/>
      <el-table-column prop="Personality" label="性格" width="120"/>
      <el-table-column prop="Hobbies" label="趣味" width="120"/>
      <el-table-column prop="Information gathering media" label="情報収集メディア" width="120"/>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
            <el-icon>
              <edit/>
            </el-icon>
            編集
          </el-button>
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
</template>

<script setup>

import {ref, onMounted} from 'vue';
import axios from 'axios';
import {Delete, Edit} from "@element-plus/icons-vue";

const users = ref([]);

const fetchUsers = async () => {
  try {
    const response = await axios.get('/data.json'); // 这里使用相对路径
    users.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const handleEdit = (index, row) => {
  // 处理用户编辑逻辑
  console.log('Edit:', row);
};

const handleDelete = (index, row) => {
  // 处理用户删除逻辑
  console.log('Delete:', row);
};

onMounted(fetchUsers);


</script>

<style scoped>

.el-button {
  margin-right: 10px;
}
</style>