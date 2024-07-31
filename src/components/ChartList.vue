<template>
  <el-container class="chart-content"
                direction="vertical"
                style="width: 100%; height: calc(100vh - 140px); overflow-y: auto;">
    <el-row :gutter="20">
      <el-col :span="isTwoColumn ? 12 : 24">
        <v-chart :option="BloodChartOptions" style="width: 450px; height: 500px;"></v-chart>
      </el-col>
      <el-col :span="isTwoColumn ? 12 : 24" v-if="isTwoColumn || ageChartOptions">
        <v-chart :option="ageChartOptions" style="width: 450px; height: 500px;"></v-chart>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="isTwoColumn ? 12 : 24">
        <v-chart :option="genderChartOptions" style="width: 450px; height: 500px;"></v-chart>
      </el-col>
    </el-row>
    <div class="answer-graph">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-select v-model="selectedQuestno" placeholder="Select Questno">
            <el-option
              v-for="(value, key) in chartData"
              :key="key"
              :label="key + ' - ' + value.quest"
              :value="key">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-select v-model="selectedMonth" placeholder="Select Month" style="margin-bottom: 20px">
            <el-option
              v-for="month in months"
              :key="month"
              :label="month"
              :value="month">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <v-chart :option="chartOptions" style="width: 100%; height: 500px;"></v-chart>
    </div>
  </el-container>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { loadDataFromAWS } from '@/utils/ToAWS';
import { PieOptions, userAttributes, parseUserData } from '@/utils/PieCharts';
import { parseAnswerData, AnswerAttributes } from '@/utils/BarCharts';

const isTwoColumn = ref(false);
const BloodChartOptions = ref(null);
const ageChartOptions = ref(null);
const genderChartOptions = ref(null);
const selectedQuestno = ref("1");
const selectedMonth = ref("01");
const chartOptions = ref({});
const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const chartData = AnswerAttributes;

use([CanvasRenderer, PieChart, BarChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent]);

// ユーザーデータを取得する関数
const fetchusersData = async () => {
  const userUrl = 'https://o5ymi5rci6dobeyypagnu44zlq0fnnlf.lambda-url.ap-northeast-1.on.aws/';
  const userRequestData = {id: 'u'};

  loadDataFromAWS(userUrl, userRequestData, (error, data) => {
    if (error) {
      console.error("Error fetching user data:", error);
      return;
    }
    console.log("Fetched user data:", data); // 調整のための出力
    parseUserData(data);
  });
};

// 回答データを取得する関数
const fetchanswersData = async () => {
  const dateRange = ref([]);
  const StartDate = ref(null);
  const EndDate = ref(null);
  const nowDate = new Date();
  dateRange.value[0] = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);
  dateRange.value[1] = new Date(nowDate.getFullYear(), nowDate.getMonth()+1, 0);
  const userUrl = 'https://o5ymi5rci6dobeyypagnu44zlq0fnnlf.lambda-url.ap-northeast-1.on.aws/';
  StartDate.value = new Date(dateRange.value[0].getFullYear(), dateRange.value[0].getMonth(), 1);
  EndDate.value = new Date(dateRange.value[1].getFullYear(), dateRange.value[1].getMonth()+1, 0);
  const userRequestData = {id: 'a', start: StartDate.value, end: EndDate.value};

  loadDataFromAWS(userUrl, userRequestData, (error, data) => {
    if (error) {
      console.error("Error fetching Answer data:", error);
      return;
    }
    console.log("Fetched Answer data:", data); // 調整のための出力
    parseAnswerData(data);
  });
};

// グラフを更新する関数
const updateChart = () => {
  const data = chartData.value[selectedQuestno.value]?.monthlyData[selectedMonth.value];
  if (data) {
    const xData = Object.keys(data.answerCounts).map(key => Number(key));
    const yData = Object.values(data.answerCounts);

    chartOptions.value = {
      title: {
        text: `${selectedQuestno.value} - ${chartData.value[selectedQuestno.value].quest}`
      },
      xAxis: {
        type: 'category',
        data: xData,
        name: '　回答数　/　人'
      },
      yAxis: {
        type: 'value',
        name: '人数'
      },
      series: [{
        data: yData,
        type: 'bar'
      }]
    };
  }
};

// 監視対象の変数が変更された時にグラフを更新する
watch([selectedQuestno, selectedMonth], updateChart);

// 初期化時にデータを取得し、グラフを更新する
onMounted(() => {
  fetchusersData();
  fetchanswersData();
  updateChart(); // 初期化時のグラフ
});

// ユーザー属性データが更新された時にグラフを更新する
watch(userAttributes, (newVal) => {
  const ageData = [
    {value: newVal.ages.filter(age => age >= 10 && age < 20).length, name: '10代'},
    {value: newVal.ages.filter(age => age >= 20 && age < 30).length, name: '20代'},
    {value: newVal.ages.filter(age => age >= 30 && age < 40).length, name: '30代'},
    {value: newVal.ages.filter(age => age >= 40 && age < 50).length, name: '40代'},
    {value: newVal.ages.filter(age => age >= 50 && age < 60).length, name: '50代'},
    {value: newVal.ages.filter(age => age >= 60).length, name: '60代以上'},
  ];
  console.log("Updated age distribution data:", ageData); // 調整のための出力
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
  console.log("Updated gender distribution data:", genderData); // 調整のための出力
  genderChartOptions.value = {
    ...PieOptions.value,
    title: {...PieOptions.value.title, text: '性別の統計'},
    series: [{...PieOptions.value.series[0], data: genderData, name: '属性'}]
  };

  const BloodType = [
    {value: newVal.bloodTypes.filter(blood => blood === 'A型').length, name: 'A型'},
    {value: newVal.bloodTypes.filter(blood =>blood === 'B型').length, name: 'B型'},
    {value: newVal.bloodTypes.filter(blood =>blood === 'O型').length, name: 'O型'},
    {value: newVal.bloodTypes.filter(blood =>blood === 'AB型').length, name: 'AB型'},
    {value: newVal.bloodTypes.filter(blood =>blood === 'その他').length, name: 'その他'},
  ]
  console.log("Updated pie chart data:", BloodType); // 調整のための出力
  BloodChartOptions.value = {
    ...PieOptions.value,
    title: {...PieOptions.value.title, text: '血型の統計'},
    series: [{...PieOptions.value.series[0], data: BloodType, name: '属性'}]
  };
}, {deep: true});

// ウィンドウサイズに応じてカラムレイアウトを変更する
const handleResize = () => {
  isTwoColumn.value = window.innerWidth >= 1200; // 設定の幅の閾値
};

// コンポーネントがマウントされた時にリサイズイベントを追加する
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize(); // 初期チェック
});

// コンポーネントがアンマウントされる時にリサイズイベントを削除する
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.chart-content {
  background-color: white;
  margin-right: 10px;
}
</style>
