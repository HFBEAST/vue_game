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
        <v-chart :option="BloodChartOptions" style="width: 500px; height: 500px;"></v-chart>
      </el-col>
      <el-col :span="isTwoColumn ? 12 : 24" v-if="isTwoColumn || hobbieChartOptions">
        <v-chart :option="educationLevelChartOptions" style="width: 500px; height: 500px;"></v-chart>
      </el-col>
    </el-row>
<el-row :gutter="20">
      <el-col :span="isTwoColumn ? 12 : 24">
        <v-chart :option="majorChartOptions" style="width: 500px; height: 500px;"></v-chart>
      </el-col>
      <el-col :span="isTwoColumn ? 12 : 24" v-if="isTwoColumn || hobbieChartOptions">
        <v-chart :option="occupationChartOptions" style="width: 500px; height: 500px;"></v-chart>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="isTwoColumn ? 12 : 24">
        <v-chart :option="departmentChartOptions" style="width: 500px; height: 500px;"></v-chart>
      </el-col>
      <el-col :span="isTwoColumn ? 12 : 24" v-if="isTwoColumn || hobbieChartOptions">
        <v-chart :option="positionChartOptions" style="width: 500px; height: 500px;"></v-chart>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="isTwoColumn ? 12 : 24">
        <v-chart :option="personalityChartOptions" style="width: 500px; height: 500px;"></v-chart>
      </el-col>
      <el-col :span="isTwoColumn ? 12 : 24" v-if="isTwoColumn || hobbieChartOptions">
        <v-chart :option="hobbieChartOptions" style="width: 500px; height: 500px;"></v-chart>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="isTwoColumn ? 12 : 24">
        <v-chart :option="mediaSourceChartOptions" style="width: 500px; height: 500px;"></v-chart>
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
        <el-col :span="6">
          <el-select v-model="selectedYear" placeholder="Select Year">
            <el-option
              v-for="year in years"
              :key="year"
              :label="year"
              :value="year">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="selectedMonth" placeholder="Select Month">
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
const educationLevelChartOptions = ref(null);
const majorChartOptions = ref(null);
const occupationChartOptions = ref(null);
const departmentChartOptions = ref(null);
const positionChartOptions = ref(null);
const personalityChartOptions = ref(null);
const hobbieChartOptions = ref(null);
const mediaSourceChartOptions = ref(null);
const selectedQuestno = ref("1");
const selectedYear = ref("2024");
const selectedMonth = ref("01");
const chartOptions = ref({});
const years = ["2023", "2024", "2025"];
const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const chartData = AnswerAttributes;

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
  dateRange.value[1] = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0);
  const userUrl = 'https://o5ymi5rci6dobeyypagnu44zlq0fnnlf.lambda-url.ap-northeast-1.on.aws/';
  StartDate.value = new Date(dateRange.value[0].getFullYear(), dateRange.value[0].getMonth(), 1);
  EndDate.value = new Date(dateRange.value[1].getFullYear(), dateRange.value[1].getMonth() + 1, 0);
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
  const data = chartData.value[selectedQuestno.value]?.yearlyData[selectedYear.value]?.monthlyData[selectedMonth.value];
  if (data) {
    const xData = Object.keys(data.answerCounts).map(key => Number(key));
    const yData = Object.values(data.answerCounts).map(count => Math.round(count)); // 人数の統計を整数にする

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
        name: '人数',
        interval: 1
      },
      series: [{
        data: yData,
        type: 'bar'
      }]
    };
  }
};

// 監視対象の変数が変更された時にグラフを更新する
watch([selectedQuestno, selectedYear, selectedMonth], updateChart);

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
    legend: {data:[]},
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
    legend: {data:[]},
    series: [{...PieOptions.value.series[0], data: genderData, name: '属性'}]
  };

  const BloodType = [
    {value: newVal.bloodTypes.filter(blood => blood === 'A型').length, name: 'A型'},
    {value: newVal.bloodTypes.filter(blood => blood === 'B型').length, name: 'B型'},
    {value: newVal.bloodTypes.filter(blood => blood === 'O型').length, name: 'O型'},
    {value: newVal.bloodTypes.filter(blood => blood === 'AB型').length, name: 'AB型'},
    {value: newVal.bloodTypes.filter(blood => blood === 'その他').length, name: 'その他'},
  ]
  console.log("Updated pie chart data:", BloodType); // 調整のための出力
  BloodChartOptions.value = {
    ...PieOptions.value,
    title: {...PieOptions.value.title, text: '血型の統計'},
    legend: {data:[]},
    series: [{...PieOptions.value.series[0], data: BloodType, name: '属性'}]
  };

  const educationLevelData = [
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === '小学校卒業').length, name: '小学校卒業'},
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === '中学校卒業').length, name: '中学校卒業'},
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === '高等学校卒業').length, name: '高等学校卒業'},
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === '専門学校卒業').length, name: '専門学校卒業'},
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === '短期大学卒業').length, name: '短期大学卒業'},
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === '大学卒業').length, name: '大学卒業'},
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === '大学院卒業（修士）').length, name: '大学院卒業（修士）'},
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === '大学院卒業（博士）').length, name: '大学院卒業（博士）'},
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === '海外留学卒業').length, name: '海外留学卒業'},
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === '短期専門学校卒業').length, name: '短期専門学校卒業'},
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === '通信制大学卒業').length, name: '通信制大学卒業'},
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === '高等教育自学試験').length, name: '高等教育自学試験'},
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === '成人高等学校卒業').length, name: '成人高等学校卒業'},
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === '成人大学卒業').length, name: '成人大学卒業'},
    {value: newVal.educationLevels.filter(educationLevel => educationLevel === 'その他').length, name: 'その他'},
  ]
  console.log("Updated pie chart data:", educationLevelData); // 调试输出
  educationLevelChartOptions.value = {
    ...PieOptions.value,
    title: {...PieOptions.value.title, text: '経歴（最終学歴）の統計'},
    legend: {data:[]},
    series: [{...PieOptions.value.series[0], data: educationLevelData, name: '属性'}]
  };

  const majorData = [
    {value: newVal.majors.filter(major => major === '経済学').length, name: '経済学'},
    {value: newVal.majors.filter(major => major === '経営学').length, name: '経営学'},
    {value: newVal.majors.filter(major => major === '法学').length, name: '法学'},
    {value: newVal.majors.filter(major => major === '医学').length, name: '医学'},
    {value: newVal.majors.filter(major => major === '看護学').length, name: '看護学'},
    {value: newVal.majors.filter(major => major === '情報科学').length, name: '情報科学'},
    {value: newVal.majors.filter(major => major === 'コンピュータ科学').length, name: 'コンピュータ科学'},
    {value: newVal.majors.filter(major => major === '機械工学').length, name: '機械工学'},
    {value: newVal.majors.filter(major => major === '電気工学').length, name: '電気工学'},
    {value: newVal.majors.filter(major => major === '建築学').length, name: '建築学'},
    {value: newVal.majors.filter(major => major === '教育学').length, name: '教育学'},
    {value: newVal.majors.filter(major => major === '心理学').length, name: '心理学'},
    {value: newVal.majors.filter(major => major === '文学').length, name: '文学'},
    {value: newVal.majors.filter(major => major === '化学').length, name: '化学'},
    {value: newVal.majors.filter(major => major === '物理学').length, name: '物理学'},
    {value: newVal.majors.filter(major => major === '生物学').length, name: '生物学'},
    {value: newVal.majors.filter(major => major === '数学').length, name: '数学'},
    {value: newVal.majors.filter(major => major === '社会学').length, name: '社会学'},
    {value: newVal.majors.filter(major => major === '政治学').length, name: '政治学'},
    {value: newVal.majors.filter(major => major === '哲学').length, name: '哲学'},
    {value: newVal.majors.filter(major => major === '人類学').length, name: '人類学'},
    {value: newVal.majors.filter(major => major === '言語学').length, name: '言語学'},
    {value: newVal.majors.filter(major => major === '地理学').length, name: '地理学'},
    {value: newVal.majors.filter(major => major === '環境科学').length, name: '環境科学'},
    {value: newVal.majors.filter(major => major === '歴史学').length, name: '歴史学'},
    {value: newVal.majors.filter(major => major === '音楽学').length, name: '音楽学'},
    {value: newVal.majors.filter(major => major === '美術学').length, name: '美術学'},
    {value: newVal.majors.filter(major => major === '体育学').length, name: '体育学'},
    {value: newVal.majors.filter(major => major === '材料科学').length, name: '材料科学'},
    {value: newVal.majors.filter(major => major === '天文学').length, name: '天文学'},
    {value: newVal.majors.filter(major => major === '獣医学').length, name: '獣医学'},
    {value: newVal.majors.filter(major => major === '薬学').length, name: '薬学'},
    {value: newVal.majors.filter(major => major === '栄養学').length, name: '栄養学'},
    {value: newVal.majors.filter(major => major === '農学').length, name: '農学'},
    {value: newVal.majors.filter(major => major === '海洋学').length, name: '海洋学'},
    {value: newVal.majors.filter(major => major === '地質学').length, name: '地質学'},
    {value: newVal.majors.filter(major => major === '環境工学').length, name: '環境工学'},
    {value: newVal.majors.filter(major => major === '生物工学').length, name: '生物工学'},
    {value: newVal.majors.filter(major => major === '宇宙工学').length, name: '宇宙工学'},
    {value: newVal.majors.filter(major => major === 'メディア学').length, name: 'メディア学'},
    {value: newVal.majors.filter(major => major === '国際関係学').length, name: '国際関係学'},
    {value: newVal.majors.filter(major => major === '生命科学').length, name: '生命科学'},
    {value: newVal.majors.filter(major => major === 'その他').length, name: 'その他'},
    {value: newVal.majors.filter(major => major === 'なし').length, name: 'なし'},
  ]
  console.log("Updated pie chart data:", majorData); // 调试输出
  majorChartOptions.value = {
    ...PieOptions.value,
    title: {...PieOptions.value.title, text: '学科の統計'},
    legend: {data:[]},
    series: [{...PieOptions.value.series[0], data: majorData, name: '属性'}]
  };

  const occupationData = [
    {value: newVal.occupations.filter(occupation => occupation === '情報技術').length, name: '情報技術'},
    {value: newVal.occupations.filter(occupation => occupation === '医療').length, name: '医療'},
    {value: newVal.occupations.filter(occupation => occupation === '教育').length, name: '教育'},
    {value: newVal.occupations.filter(occupation => occupation === '金融').length, name: '金融'},
    {value: newVal.occupations.filter(occupation => occupation === '製造').length, name: '製造'},
    {value: newVal.occupations.filter(occupation => occupation === '小売').length, name: '小売'},
    {value: newVal.occupations.filter(occupation => occupation === '流通').length, name: '流通'},
    {value: newVal.occupations.filter(occupation => occupation === '情報通信').length, name: '情報通信'},
    {value: newVal.occupations.filter(occupation => occupation === '観光').length, name: '観光'},
    {value: newVal.occupations.filter(occupation => occupation === '広告').length, name: '広告'},
    {value: newVal.occupations.filter(occupation => occupation === '建設').length, name: '建設'},
    {value: newVal.occupations.filter(occupation => occupation === 'エネルギー').length, name: 'エネルギー'},
    {value: newVal.occupations.filter(occupation => occupation === '不動産').length, name: '不動産'},
    {value: newVal.occupations.filter(occupation => occupation === 'メディア').length, name: 'メディア'},
    {value: newVal.occupations.filter(occupation => occupation === '自動車').length, name: '自動車'},
    {value: newVal.occupations.filter(occupation => occupation === '食品').length, name: '食品'},
    {value: newVal.occupations.filter(occupation => occupation === 'ファッション').length, name: 'ファッション'},
    {value: newVal.occupations.filter(occupation => occupation === '化学').length, name: '化学'},
    {value: newVal.occupations.filter(occupation => occupation === '農業').length, name: '農業'},
    {value: newVal.occupations.filter(occupation => occupation === '保険').length, name: '保険'},
    {value: newVal.occupations.filter(occupation => occupation === '法律').length, name: '法律'},
    {value: newVal.occupations.filter(occupation => occupation === 'スポーツ').length, name: 'スポーツ'},
    {value: newVal.occupations.filter(occupation => occupation === '人材').length, name: '人材'},
    {value: newVal.occupations.filter(occupation => occupation === '航空').length, name: '航空'},
    {value: newVal.occupations.filter(occupation => occupation === '電子商取引').length, name: '電子商取引'},
    {value: newVal.occupations.filter(occupation => occupation === '福祉').length, name: '福祉'},
    {value: newVal.occupations.filter(occupation => occupation === '美容').length, name: '美容'},
    {value: newVal.occupations.filter(occupation => occupation === '出版').length, name: '出版'},
    {value: newVal.occupations.filter(occupation => occupation === '音楽').length, name: '音楽'},
    {value: newVal.occupations.filter(occupation => occupation === 'リサイクル').length, name: 'リサイクル'},
    {value: newVal.occupations.filter(occupation => occupation === '家具').length, name: '家具'},
    {value: newVal.occupations.filter(occupation => occupation === 'ペット').length, name: 'ペット'},
    {value: newVal.occupations.filter(occupation => occupation === 'その他').length, name: 'その他'},
    {value: newVal.occupations.filter(occupation => occupation === 'なし').length, name: 'なし'},
  ]
  console.log("Updated pie chart data:", occupationData); // 调试输出
  occupationChartOptions.value = {
    ...PieOptions.value,
    title: {...PieOptions.value.title, text: '職業の統計'},
    legend: {data:[]},
    series: [{...PieOptions.value.series[0], data: occupationData, name: '属性'}]
  };

  const departmentData = [
    {value: newVal.departments.filter(department => department === '研究開発部').length, name: '研究開発部'},
    {value: newVal.departments.filter(department => department === '人事部').length, name: '人事部'},
    {value: newVal.departments.filter(department => department === '総務部').length, name: '総務部'},
    {value: newVal.departments.filter(department => department === '経理部').length, name: '経理部'},
    {value: newVal.departments.filter(department => department === '営業部').length, name: '営業部'},
    {value: newVal.departments.filter(department => department === 'マーケティング部').length, name: 'マーケティング部'},
    {value: newVal.departments.filter(department => department === 'IT部門').length, name: 'IT部門'},
    {value: newVal.departments.filter(department => department === '製造部').length, name: '製造部'},
    {value: newVal.departments.filter(department => department === '品質管理部').length, name: '品質管理部'},
    {value: newVal.departments.filter(department => department === 'カスタマーサービス部').length, name: 'カスタマーサービス部'},
    {value: newVal.departments.filter(department => department === 'ロジスティクス部').length, name: 'ロジスティクス部'},
    {value: newVal.departments.filter(department => department === '法務部').length, name: '法務部'},
    {value: newVal.departments.filter(department => department === '広報部').length, name: '広報部'},
    {value: newVal.departments.filter(department => department === '企画部').length, name: '企画部'},
    {value: newVal.departments.filter(department => department === '購買部').length, name: '購買部'},
    {value: newVal.departments.filter(department => department === 'サプライチェーン統括部').length, name: 'サプライチェーン統括部'},
    {value: newVal.departments.filter(department => department === 'サービス部').length, name: 'サービス部'},
    {value: newVal.departments.filter(department => department === '事業開発部').length, name: '事業開発部'},
    {value: newVal.departments.filter(department => department === '知的財産部').length, name: '知的財産部'},
    {value: newVal.departments.filter(department => department === '安全衛生部').length, name: '安全衛生部'},
    {value: newVal.departments.filter(department => department === 'グローバル事業部').length, name: 'グローバル事業部'},
    {value: newVal.departments.filter(department => department === '資材部').length, name: '資材部'},
    {value: newVal.departments.filter(department => department === 'その他').length, name: 'その他'},
    {value: newVal.departments.filter(department => department === 'なし').length, name: 'なし'},
  ]
  console.log("Updated pie chart data:", departmentData); // 调试输出
  departmentChartOptions.value = {
    ...PieOptions.value,
    title: {...PieOptions.value.title, text: '部署の統計'},
    legend: {data:[]},
    series: [{...PieOptions.value.series[0], data: departmentData, name: '属性'}]
  };

  const positionData = [
    {value: newVal.positions.filter(position => position === '一般社員').length, name: '一般社員'},
    {value: newVal.positions.filter(position => position === 'アシスタント').length, name: 'アシスタント'},
    {value: newVal.positions.filter(position => position === 'チームリーダー').length, name: 'チームリーダー'},
    {value: newVal.positions.filter(position => position === '技術リーダー').length, name: '技術リーダー'},
    {value: newVal.positions.filter(position => position === 'コンサルタント').length, name: 'コンサルタント'},
    {value: newVal.positions.filter(position => position === 'プロジェクトマネージャー').length, name: 'プロジェクトマネージャー'},
    {value: newVal.positions.filter(position => position === '係長').length, name: '係長'},
    {value: newVal.positions.filter(position => position === '主任').length, name: '主任'},
    {value: newVal.positions.filter(position => position === '課長').length, name: '課長'},
    {value: newVal.positions.filter(position => position === '部長').length, name: '部長'},
    {value: newVal.positions.filter(position => position === '取締役').length, name: '取締役'},
    {value: newVal.positions.filter(position => position === '副社長').length, name: '副社長'},
    {value: newVal.positions.filter(position => position === '社長').length, name: '社長'},
    {value: newVal.positions.filter(position => position === '代表取締役').length, name: '代表取締役'},
    {value: newVal.positions.filter(position => position === 'その他').length, name: 'その他'},
    {value: newVal.positions.filter(position => position === 'なし').length, name: 'なし'},
  ]
  console.log("Updated pie chart data:", positionData); // 调试输出
  positionChartOptions.value = {
    ...PieOptions.value,
    title: {...PieOptions.value.title, text: '役職（職位）の統計'},
    legend: {data:[]},
    series: [{...PieOptions.value.series[0], data: positionData, name: '属性'}]
  };

  const personalityData = [
    {value: newVal.personalities.filter(personality => personality === '外向的').length, name: '外向的'},
    {value: newVal.personalities.filter(personality => personality === '内向的').length, name: '内向的'},
    {value: newVal.personalities.filter(personality => personality === '楽観的').length, name: '楽観的'},
    {value: newVal.personalities.filter(personality => personality === '悲観的').length, name: '悲観的'},
    {value: newVal.personalities.filter(personality => personality === '誠実的').length, name: '誠実的'},
    {value: newVal.personalities.filter(personality => personality === '冒険的').length, name: '冒険的'},
    {value: newVal.personalities.filter(personality => personality === '責任感が強い').length, name: '責任感が強い'},
    {value: newVal.personalities.filter(personality => personality === '創造的').length, name: '創造的'},
    {value: newVal.personalities.filter(personality => personality === '行動的').length, name: '行動的'},
    {value: newVal.personalities.filter(personality => personality === '協力的').length, name: '協力的'},
    {value: newVal.personalities.filter(personality => personality === '情熱的').length, name: '情熱的'},
    {value: newVal.personalities.filter(personality => personality === '慎重な').length, name: '慎重な'},
    {value: newVal.personalities.filter(personality => personality === '温厚な').length, name: '温厚な'},
    {value: newVal.personalities.filter(personality => personality === '冷静な').length, name: '冷静な'},
    {value: newVal.personalities.filter(personality => personality === 'その他').length, name: 'その他'},
  ]
  console.log("Updated pie chart data:", personalityData); // 调试输出
  personalityChartOptions.value = {
    ...PieOptions.value,
    title: {...PieOptions.value.title, text: '性格の統計'},
    legend: {data:[]},
    series: [{...PieOptions.value.series[0], data: personalityData, name: '属性'}]
  };

  const hobbieData = [
    {value: newVal.hobbies.filter(hobbie => hobbie === '旅行').length, name: '旅行'},
    {value: newVal.hobbies.filter(hobbie => hobbie === '音楽鑑賞').length, name: '音楽鑑賞'},
    {value: newVal.hobbies.filter(hobbie => hobbie === '映画鑑賞').length, name: '映画鑑賞'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'スポーツ').length, name: 'スポーツ'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'ジョギング').length, name: 'ジョギング'},
    {value: newVal.hobbies.filter(hobbie => hobbie === '料理').length, name: '料理'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'ゲーム').length, name: 'ゲーム'},
    {value: newVal.hobbies.filter(hobbie => hobbie === '写真撮影').length, name: '写真撮影'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'ダンス').length, name: 'ダンス'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'ハイキング').length, name: 'ハイキング'},
    {value: newVal.hobbies.filter(hobbie => hobbie === '絵画').length, name: '絵画'},
    {value: newVal.hobbies.filter(hobbie => hobbie === '手芸').length, name: '手芸'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'サイクリング').length, name: 'サイクリング'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'ヨガ').length, name: 'ヨガ'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'フィッシング').length, name: 'フィッシング'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'キャンプ').length, name: 'キャンプ'},
    {value: newVal.hobbies.filter(hobbie => hobbie === '囲碁・将棋').length, name: '囲碁・将棋'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'パズル').length, name: 'パズル'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'ボランティア活動').length, name: 'ボランティア活動'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'サーフィン').length, name: 'サーフィン'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'スキー・スノーボード').length, name: 'スキー・スノーボード'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'スキューバダイビング').length, name: 'スキューバダイビング'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'ビリヤード').length, name: 'ビリヤード'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'ジム').length, name: 'ジム'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'ガーデニング').length, name: 'ガーデニング'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'DIY').length, name: 'DIY'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'アウトドア').length, name: 'アウトドア'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'ゴルフ').length, name: 'ゴルフ'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'ペット').length, name: 'ペット'},
    {value: newVal.hobbies.filter(hobbie => hobbie === '車・バイク').length, name: '車・バイク'},
    {value: newVal.hobbies.filter(hobbie => hobbie === '天体観測').length, name: '天体観測'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'ファッション').length, name: 'ファッション'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'アニメ・マンガ').length, name: 'アニメ・マンガ'},
    {value: newVal.hobbies.filter(hobbie => hobbie === 'その他').length, name: 'その他'},
  ]
  console.log("Updated pie chart data:", hobbieData); // 调试输出
  hobbieChartOptions.value = {
    ...PieOptions.value,
    title: {...PieOptions.value.title, text: '趣味の統計'},
    legend: {data:[]},
    series: [{...PieOptions.value.series[0], data: hobbieData, name: '属性'}]
  };

  const mediaSourceData = [
    {value: newVal.mediaSources.filter(mediaSource => mediaSource === 'テレビ').length, name: 'テレビ'},
    {value: newVal.mediaSources.filter(mediaSource => mediaSource === '新聞').length, name: '新聞'},
    {value: newVal.mediaSources.filter(mediaSource => mediaSource === 'Webサイト・アプリ').length, name: 'Webサイト・アプリ'},
    {value: newVal.mediaSources.filter(mediaSource => mediaSource === 'SNS').length, name: 'SNS'},
    {value: newVal.mediaSources.filter(mediaSource => mediaSource === 'ラジオ').length, name: 'ラジオ'},
    {value: newVal.mediaSources.filter(mediaSource => mediaSource === '雑誌').length, name: '雑誌'},
    {value: newVal.mediaSources.filter(mediaSource => mediaSource === 'その他').length, name: 'その他'},
  ]
  console.log("Updated pie chart data:", mediaSourceData); // 调试输出
  mediaSourceChartOptions.value = {
    ...PieOptions.value,
    title: {...PieOptions.value.title, text: '情報収集メディアの統計'},
    legend: {data:[]},
    series: [{...PieOptions.value.series[0], data: mediaSourceData, name: '属性'}]
  };
}, {deep: true});


</script>

<style scoped>
.chart-content {
  background-color: white;
  margin-right: 10px;
}
</style>
