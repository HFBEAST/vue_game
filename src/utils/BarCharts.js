import { ref } from "vue";

export const AnswerAttributes = ref({});
export const ChartData = ref({});

// answerdataを解析する関数
export const parseAnswerData = (data) => {
  const attributes = {};

  data.forEach(item => {
    const questno = item.questno; // 質問番号
    const quest = item.quest; // 質問内容
    const month = item.file.substring(4, 6); // ファイル名の5、6文字目は月を表す
    const answerCount = item.answer.split('|').length - 1; // answerの中で'|'で分割し、2番目以降の個数を数える

    if (!attributes[questno]) {
      attributes[questno] = {
        quest,
        monthlyData: {} // 月ごとのデータを保存するオブジェクト
      };
    }

    if (!attributes[questno].monthlyData[month]) {
      attributes[questno].monthlyData[month] = {
        count: 0,
        answers: [],
        answerCounts: {} // answerCountごとの個数を保存するオブジェクト
      };
    }

    // 月ごとの回答数を加算
    attributes[questno].monthlyData[month].count += answerCount;
    // 回答内容を保存
    attributes[questno].monthlyData[month].answers.push(item.answer);

    if (!attributes[questno].monthlyData[month].answerCounts[answerCount]) {
      attributes[questno].monthlyData[month].answerCounts[answerCount] = 0;
    }
    // answerCountごとの個数を加算
    attributes[questno].monthlyData[month].answerCounts[answerCount]++;
  });

  // グローバルデータに設定
  AnswerAttributes.value = attributes;
  ChartData.value = attributes;
  console.log("Parsed answer attributes in BarCharts:", AnswerAttributes.value); // 調整のための出力
};

// answerdataを解析する関数  構造
// {
//   "1": {
//     "quest": "テスト質問1",
//     "monthlyData": {
//       "07": {
//         "count": 4,
//         "answers": [
//           "12:40:54.822|東京:12:40:58.240:6|神奈川:12:41:01.704:6|",
//           "12:54:04.801|日本:12:54:09.304:6|大阪:12:54:13.167:6|福岡:12:54:16.399:6|"
//         ],
//         "answerCounts": {
//           "2": 1,
//           "3": 1
//         }
//       }
//     }
//   }
//  }