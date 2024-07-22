import requests
import json

# 定义目标URL
url = "https://o5ymi5rci6dobeyypagnu44zlq0fnnlf.lambda-url.ap-northeast-1.on.aws/"

# 发送GET请求获取数据
response = requests.get(url)

# 检查请求是否成功
if response.status_code == 200:
    # 解析JSON数据
    data = response.json()

    # 定义要添加到id后的item列表
    items = [
        "userid", "Age", "Gender", "Blood type", "Educational background (Highest education)",
        "Major/Field of study", "Occupation", "Department", "Position (job title)",
        "Personality", "Hobbies", "Information gathering media", "create_dt"
    ]

    # 创建目标结构的字典
    result = {"data": {"id": "u"}}

    # 将数据填充到目标结构中
    for item in items:
        result["data"][item] = data.get(item, "")

    # 打印结果
    print(json.dumps(result, indent=4))

else:
    print(f"请求失败，状态码: {response.status_code}")
