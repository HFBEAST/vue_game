// 解析 CSV 数据为 JSON 格式
export const UsersCSV = (csv) => {
  const lines = csv.split('\n');
  const result = [];
  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    const currentline = lines[i].split(',');

    // 跳过空行或字段数量不匹配的行
    if (currentline.length !== headers.length) {
      continue;
    }

    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = currentline[j] ? currentline[j].trim() : '';
    }

    result.push(obj);
  }

  return result;
};

export const QestionsCSV = (csv) => {
  const lines = csv.split('\n');
  const result = [];

  for (let i = 0; i < lines.length; i++) { // 从第一行开始处理
    const currentline = lines[i].split(',');

    // 跳过空行
    if (currentline.length < 3) {
      continue;
    }

    const obj = {
      id: currentline[1].trim(),
      question: currentline.slice(2).join(',').trim()
    };

    result.push(obj);
  }

  return result;
};

export const AnswersCSV = (csv) => {
  const lines = csv.split('\n');
  const result = [];

  // 第一行是标题
  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    const currentline = lines[i].split(',');
    // console.log("lines : ",currentline);

    // 跳过空行
    if (currentline.length < 2) {
      continue;
    }

    const obj = {};
    for (let j = 1; j < headers.length - 1; j++) {
      obj[headers[j].trim()] = currentline[j] ? currentline[j].trim() : '';
    }

    // 将剩余的所有数据合并作为最后一个标题的内容
    obj[headers[headers.length - 1].trim()] = currentline.slice(headers.length-1).join(',').trim();

    result.push(obj);
  }

  return result;
};

// 从 AWS 获取数据
export const loadDataFromAWS = (url, data, callback) => {
  const json = { data: {} };
  Object.assign(json.data, data);
  const Http = new XMLHttpRequest();
  Http.open("POST", url, true);
  // Http.setRequestHeader('Content-Type', 'application/json'); // 设置请求头
  Http.send(JSON.stringify(json));

  Http.onreadystatechange = () => {
    if (Http.readyState === 4) {
      console.log('HTTP status:', Http.status);
      //console.log('Response text:', Http.responseText); // 打印原始响应文本

      let parsedData = null;

      if (Http.status === 200) {
        try {
          const csvData = Http.responseText;
          if (data.id === "u") {
            parsedData = UsersCSV(csvData);
          }else if(data.id === "q"){
            parsedData = QestionsCSV(csvData);
          }else if(data.id === "a"){
            parsedData = AnswersCSV(csvData);
          }
          console.log("Data loaded from AWS:", parsedData);
          callback(null, parsedData); // 执行回调函数
          //console.log("Data loaded from AWS:", parsedData);
        } catch (error) {
          callback(error, null); // 执行回调函数，传递错误
          console.error("Error parsing CSV response:", error);
        }
      } else {
        callback(new Error(Http.statusText), null); // 执行回调函数，传递错误
        console.error("Error fetching data from AWS:", Http.statusText);
      }
    }
  };
};