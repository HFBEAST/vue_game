import { ref } from "vue";

export const AnswerAttributes = ref({});
export const ChartData = ref({});

// answerdataを解析する関数
export const parseAnswerData = (data) => {
  const attributes = {};

  data.forEach(item => {
    const questno = item.questno; // 質問番号
    const quest = item.quest; // 質問内容
    const year = item.file.substring(0, 4); // ファイル名の前4文字は年を表す
    const month = item.file.substring(4, 6); // ファイル名の5、6文字目は月を表す
    const answerCount = item.answer.split('|').length - 1; // answerの中で'|'で分割し、2番目以降の個数を数える

    if (!attributes[questno]) {
      attributes[questno] = {
        quest,
        yearlyData: {} // 年ごとのデータを保存するオブジェクト
      };
    }

    if (!attributes[questno].yearlyData[year]) {
      attributes[questno].yearlyData[year] = {
        monthlyData: {} // 月ごとのデータを保存するオブジェクト
      };
    }

    if (!attributes[questno].yearlyData[year].monthlyData[month]) {
      attributes[questno].yearlyData[year].monthlyData[month] = {
        count: 0,
        answers: [],
        answerCounts: {} // answerCountごとの個数を保存するオブジェクト
      };
    }

    // 月ごとの回答数を加算
    attributes[questno].yearlyData[year].monthlyData[month].count += answerCount;
    // 回答内容を保存
    attributes[questno].yearlyData[year].monthlyData[month].answers.push(item.answer);

    if (!attributes[questno].yearlyData[year].monthlyData[month].answerCounts[answerCount]) {
      attributes[questno].yearlyData[year].monthlyData[month].answerCounts[answerCount] = 0;
    }
    // answerCountごとの個数を加算
    attributes[questno].yearlyData[year].monthlyData[month].answerCounts[answerCount]++;
  });

  // グローバルデータに設定
  AnswerAttributes.value = attributes;
  ChartData.value = attributes;
  console.log("Parsed answer attributes in BarCharts:", AnswerAttributes.value); // 調整のための出力
};
