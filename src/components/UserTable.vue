<template>
  <div class="content">
    <el-button type="primary" @click="CSVDownload">
      <el-icon style="margin-right: 5px;"><Download /></el-icon>
      .CSV Download</el-button>
      <el-table
          border resizable
          :data="formattedUsers"
          style="width: 100%; max-height: 600px; height: 400px; overflow-y: auto; overflow-x: hidden;"
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
        <el-table-column prop="create_dt" label="create_dt" width="120"/>
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
import {ref, onMounted, computed} from 'vue';
import {loadDataFromAWS} from '@/utils/ToAWS';
import {Delete, Edit} from "@element-plus/icons-vue";

const users = ref([]);

const fetchAWSData = () => {
  const url = 'https://o5ymi5rci6dobeyypagnu44zlq0fnnlf.lambda-url.ap-northeast-1.on.aws/';
  const requestData = {id: 'u'};

  loadDataFromAWS(url, requestData, (error, data) => {
    if (error) {
      console.error("Error fetching or parsing data:", error);
      return;
    }
    users.value = data; // 更新 awsdata 响应式变量
  });
};

const formattedUsers = computed(() => {
  return users.value.map(user => {
    return {
      ...user,
      "Major/Field of study": user["Major/Field of study"].replace(/\|/g, ','),
      "Occupation": user["Occupation"].replace(/\|/g, ','),
      "Department": user["Department"].replace(/\|/g, ','),
      "Position (job title)": user["Position (job title)"].replace(/\|/g, ','),
      "Personality": user["Personality"].replace(/\|/g, ','),
      "Hobbies": user["Hobbies"].replace(/\|/g, ','),
      "Information gathering media": user["Information gathering media"].replace(/\|/g, ','),
      "create_dt": user["create_dt"].split(' ')[0] // 只显示年月日
    };
  });
});

const CSVDownload = () => {
  const headers = Object.keys(formattedUsers.value[0]);
  const csvRows = [headers.join(',')];

  users.value.forEach(user => {
    const values = headers.map(header => {
      if (Array.isArray(user[header])) {
        return user[header].join(' | ');
      }
      return user[header];
    });
    csvRows.push(values.join(','));
  });

  const csvData = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const csvUrl = URL.createObjectURL(csvData);
  const a = document.createElement('a');
  a.setAttribute('href', csvUrl);
  a.setAttribute('download', 'users.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const handleEdit = (index, row) => {
  // 处理用户编辑逻辑
  console.log('Edit:', row);
};

const handleDelete = (index, row) => {
  // 处理用户删除逻辑
  console.log('Delete:', row);
};

onMounted(fetchAWSData);
</script>

<style scoped>
.el-button {
  margin-right: 10px;
}

.content {
  max-height: 600px; /* 调整高度以适应您的布局 */
  overflow: auto; /* 添加滚动条 */
}
</style>
