<template>
  <div>
    <el-scrollbar height="800px">
    <h2>月単位の統計</h2>
    <v-chart :options="monthlyOptions" style="height: 400px;"></v-chart>
    <h2>問題単位の統計</h2>
    <v-chart :options="questionOptions" style="height: 400px;"></v-chart>
    <h2>ユーザー属性の統計</h2>
    <v-chart :options="userPieOptions" style="height: 400px;"></v-chart>
      </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { loadDataFromAWS } from '@/utils/ToAWS';

use([CanvasRenderer, BarChart, PieChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent]);

const monthlyData = ref({
  months: [],
  excellent: [],
  great: [],
  good: [],
  score: [],
});

const questionData = ref({
  questions: [],
  excellent: [],
  great: [],
  good: [],
  score: [],
});

const userAttributes = ref({
  ages: [],
  bloodTypes: [],
  departments: [],
  educationLevels: [],
  genders: [],
  hobbies: [],
  mediaSources: [],
  majors: [],
  occupations: [],
  personalities: [],
  positions: [],
});

const parseUserData = (data) => {
  const attributes = {
    ages: [],
    bloodTypes: [],
    departments: [],
    educationLevels: [],
    genders: [],
    hobbies: [],
    mediaSources: [],
    majors: [],
    occupations: [],
    personalities: [],
    positions: [],
  };

  data.forEach(item => {
    if (item.Age) attributes.ages.push(item.Age);
    if (item["Blood type"]) attributes.bloodTypes.push(item["Blood type"]);
    if (item.Department) attributes.departments.push(...item.Department.split('|'));
    if (item["Educational background (Highest education)"]) attributes.educationLevels.push(item["Educational background (Highest education)"]);
    if (item.Gender) attributes.genders.push(item.Gender);
    if (item.Hobbies) attributes.hobbies.push(...item.Hobbies.split('|'));
    if (item["Information gathering media"]) attributes.mediaSources.push(...item["Information gathering media"].split('|'));
    if (item["Major/Field of study"]) attributes.majors.push(item["Major/Field of study"]);
    if (item.Occupation) attributes.occupations.push(...item.Occupation.split('|'));
    if (item.Personality) attributes.personalities.push(...item.Personality.split('|'));
    if (item["Position (job title)"]) attributes.positions.push(item["Position (job title)"]);
  });

  userAttributes.value = attributes;
  console.log("Parsed user attributes:", userAttributes.value); // 调试输出
};

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

const monthlyOptions = ref({
  title: {
    text: '月単位の統計',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: monthlyData.value.months,
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Excellent',
      type: 'bar',
      data: monthlyData.value.excellent,
    },
    {
      name: 'Great',
      type: 'bar',
      data: monthlyData.value.great,
    },
    {
      name: 'Good',
      type: 'bar',
      data: monthlyData.value.good,
    },
    {
      name: 'Score',
      type: 'bar',
      data: monthlyData.value.score,
    },
  ],
});

const questionOptions = ref({
  title: {
    text: '問題単位の統計',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: questionData.value.questions,
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Excellent',
      type: 'bar',
      data: questionData.value.excellent,
    },
    {
      name: 'Great',
      type: 'bar',
      data: questionData.value.great,
    },
    {
      name: 'Good',
      type: 'bar',
      data: questionData.value.good,
    },
    {
      name: 'Score',
      type: 'bar',
      data: questionData.value.score,
    },
  ],
});

const userPieOptions = ref({
  title: {
    text: 'ユーザー属性の統計',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: '属性',
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
});

// 监听 userAttributes 的变化，并更新饼图数据
watch(userAttributes, (newVal) => {
  const pieData = [
    {value: newVal.ages.length, name: '年齢'},
    {value: newVal.bloodTypes.length, name: '血液型'},
    {value: newVal.departments.length, name: '部署'},
    {value: newVal.educationLevels.length, name: '学歴'},
    {value: newVal.genders.length, name: '性別'},
    {value: newVal.hobbies.length, name: '趣味'},
    {value: newVal.mediaSources.length, name: '情報収集メディア'},
    {value: newVal.majors.length, name: '専攻'},
    {value: newVal.occupations.length, name: '職業'},
    {value: newVal.personalities.length, name: '性格'},
    {value: newVal.positions.length, name: '役職'},
  ];

  console.log("Updated pie chart data:", pieData); // 调试输出
  userPieOptions.value.series[0].data = pieData;
}, {deep: true});
</script>

<style scoped>
h2 {
  text-align: center;
  margin: 20px 0;
}
</style>
