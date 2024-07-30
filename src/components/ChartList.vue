<template>
  <el-container class="chart-content" direction="vertical" style="width: 100%; height: calc(100vh - 190px); overflow-y: auto;">
    <el-row :gutter="20">
      <el-col :span="isTwoColumn ? 12 : 24">
        <v-chart :option="BloodChartOptions" style="width: 500px; height: 500px;"></v-chart>
      </el-col>
      <el-col :span="isTwoColumn ? 12 : 24" v-if="isTwoColumn || ageChartOptions">
        <v-chart :option="ageChartOptions" style="width: 500px; height: 500px;"></v-chart>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="isTwoColumn ? 12 : 24">
        <v-chart :option="genderChartOptions" style="width: 500px; height: 500px;"></v-chart>
      </el-col>
    </el-row>
  </el-container>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { loadDataFromAWS } from '@/utils/ToAWS';
import { PieOptions, userAttributes, parseUserData } from '@/utils/PieCharts';

const isTwoColumn = ref(false);
const BloodChartOptions = ref(null);
const ageChartOptions = ref(null);
const genderChartOptions = ref(null);

const handleResize = () => {
  isTwoColumn.value = window.innerWidth >= 1200; // 设置宽度阈值
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize(); // 初始检查窗口大小
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

use([CanvasRenderer, PieChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent]);

const fetchData = async () => {
  const userUrl = 'https://o5ymi5rci6dobeyypagnu44zlq0fnnlf.lambda-url.ap-northeast-1.on.aws/';
  const userRequestData = {id: 'u'};

  loadDataFromAWS(userUrl, userRequestData, (error, data) => {
    if (error) {
      console.error("Error fetching user data:", error);
      return;
    }
    console.log("Fetched user data:", data); // 调试输出
    parseUserData(data);
  });
};

onMounted(() => {
  fetchData();
});

// 监听 userAttributes 的变化，并更新饼图数据
watch(userAttributes, (newVal) => {
  const ageData = [
    {value: newVal.ages.filter(age => age >= 10 && age < 20).length, name: '10代'},
    {value: newVal.ages.filter(age => age >= 20 && age < 30).length, name: '20代'},
    {value: newVal.ages.filter(age => age >= 30 && age < 40).length, name: '30代'},
    {value: newVal.ages.filter(age => age >= 40 && age < 50).length, name: '40代'},
    {value: newVal.ages.filter(age => age >= 50 && age < 60).length, name: '50代'},
    {value: newVal.ages.filter(age => age >= 60).length, name: '60代以上'},
  ];
  console.log("Updated age distribution data:", ageData); // 调试输出
  ageChartOptions.value = {
    ...PieOptions.value,
    title: {...PieOptions.value.title, text: '年齢の統計'},
    series: [{...PieOptions.value.series[0], data: ageData, name: '属性'}]
  };

  const genderData = [
    {value: newVal.genders.filter(gender => gender === '男性').length, name: '男性'},
    {value: newVal.genders.filter(gender => gender === '女性').length, name: '女性'},
    {value: newVal.genders.filter(gender => gender !== '男性' && gender !== '女性').length, name: 'その他'},
  ];
  console.log("Updated gender distribution data:", genderData); // 调试输出
  genderChartOptions.value = {
    ...PieOptions.value,
    title: {...PieOptions.value.title, text: '性別の統計'},
    series: [{...PieOptions.value.series[0], data: genderData, name: '属性'}]
  };

  const BloodType = [
    {value: newVal.bloodTypes.filter(blood => blood === 'A型').length, name: 'A型'},
    {value: newVal.bloodTypes.filter(blood => blood === 'B型').length, name: 'B型'},
    {value: newVal.bloodTypes.filter(blood => blood === 'O型').length, name: 'O型'},
    {value: newVal.bloodTypes.filter(blood => blood === 'AB型').length, name: 'AB型'},
    {value: newVal.bloodTypes.filter(blood => blood === 'その他').length, name: 'その他'},
  ]
  console.log("Updated pie chart data:", BloodType); // 调试输出
  BloodChartOptions.value = {
    ...PieOptions.value,
    title: {...PieOptions.value.title, text: '血型の統計'},
    series: [{...PieOptions.value.series[0], data: BloodType, name: '属性'}]
  };
}, {deep: true});

</script>

<style scoped>
.chart-content {
  background-color: white;
  width: calc(100% - 200px);
  margin-right: 10px;
}
</style>
