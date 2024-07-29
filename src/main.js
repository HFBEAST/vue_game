import { createApp } from 'vue';

// 整体导入 ElementPlus 组件库
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import App from './App.vue';
import router from './router';

// 引入 vue-echarts
import VueECharts from 'vue-echarts';

// 创建 Vue 应用实例
const app = createApp(App);

// 自动化注册全局组件
const requireComponent = require.context(
  // 组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /[A-Z]\w+\.(vue|js)$/
);

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName);
  // 获取组件的 PascalCase 名称
  const componentName = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');
  // 全局注册组件
  app.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，那么就会优先使用 `componentConfig.default`
    componentConfig.default || componentConfig
  );
});

// 注册 ElementPlus 组件库中的所有图标到全局 Vue 应用中
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(ElementPlus);
app.use(router);

// 注册 vue-echarts 组件
app.component('v-chart', VueECharts);

app.mount('#app');
