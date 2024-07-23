<template>
  <div class="content">
    <HeaderNav title="Test Page"/>
    <div class="main-content">
      <h2>Test Content</h2>
      <p>This is the test page.</p>

      <!-- 显示从 AWS 获取的数据 -->
      <pre>{{ awsdata ? JSON.stringify(awsdata, null, 2) : 'Loading data...' }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { loadDataFromAWS } from '@/utils/ToAWS'; // 确保导入路径正确

const awsdata = ref(null); // 初始化 awsdata 响应式变量

const fetchAWSData = () => {
  const url = 'https://o5ymi5rci6dobeyypagnu44zlq0fnnlf.lambda-url.ap-northeast-1.on.aws/';
  const requestData = { id: 'a', year: "2024", month: "07" };

  loadDataFromAWS(url, requestData, (error, data) => {
    if (error) {
      console.error("Error fetching or parsing data:", error);
      return;
    }
    awsdata.value = data; // 更新 awsdata 响应式变量
  });
};

onMounted(fetchAWSData); // 在组件挂载时调用 fetchAWSData 函数
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
