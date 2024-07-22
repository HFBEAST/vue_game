<template>
  <div>
    <v-chart :option="chartOptions" style="width: 100%; height: 400px;"></v-chart>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';
import { use } from 'echarts/core';
import VChart from 'vue-echarts';

// 使用 ECharts 模块
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
]);

const chartOptions = ref({
  title: {
    text: '示例图表'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['销量']
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '销量',
      type: 'line',
      data: [820, 932, 901, 934, 1290, 1330]
    }
  ]
});

onMounted(() => {
  // 可以在这里初始化一些数据或操作
});
</script>

<style scoped>
/* 添加样式以适应不同的屏幕尺寸 */
</style>
