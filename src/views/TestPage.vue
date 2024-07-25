<template>
  <div>
    <h2>ユーザー属性の統計</h2>
    <v-chart :options="pieOptions" style="height: 400px;"></v-chart>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';

// 使用 ECharts 组件
echarts.use([PieChart, CanvasRenderer, TitleComponent, TooltipComponent, LegendComponent]);

// 定义饼图数据
const pieData = [
  {value: 7, name: '年齢'},
  {value: 7, name: '血液型'},
  {value: 11, name: '部署'},
  {value: 7, name: '学歴'},
  {value: 7, name: '性別'},
  {value: 14, name: '趣味'},
  {value: 9, name: '情報収集メディア'},
  {value: 7, name: '専攻'},
  {value: 10, name: '職業'},
  {value: 13, name: '性格'},
  {value: 7, name: '役職'}
];

// 定义饼图选项
const pieOptions = ref({
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
      data: pieData,
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

// 在 onMounted 中初始化图表选项
onMounted(() => {
  console.log("Component mounted, initializing pie chart options.");
  pieOptions.value.series[0].data = pieData;
});
</script>

<style scoped>
h2 {
  text-align: center;
  margin: 20px 0;
}
</style>
