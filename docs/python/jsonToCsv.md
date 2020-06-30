# json文件与csv文件的互相转化

- 2020.06.15

## json转csv

```py
import json
import csv
import pandas

'''
json文件转化为csv
2020.06.15
'''
def transJson2Csv(jsonpath = 'demo.json', csvpath = 'demo.csv'):
    json_file = open(jsonpath, 'r', encoding='utf8')
    csv_file = open(csvpath, 'w', newline='')
    keys = []
    writer = csv.writer(csv_file)

    json_data = json_file.read()
    dic_data = json.loads(json_data, encoding='utf8')

    for dic in dic_data:
        keys = dic.keys()
        # 写入列名
        writer.writerow(keys)
        break

    for dic in dic_data:
        for key in keys:
            if key not in dic:
                dic[key] = ''
        writer.writerow(dic.values())
    json_file.close()
    csv_file.close()
```

## csv转json

```py
'''
csv文件转化为json
2020.06.15
'''
def transCsv2Json(csvpath = 'demo.csv', jsonpath = 'demo.json'):
    df = pandas.read_csv(csvpath, encoding="utf-8")
    dict_list = []
    for index, row in df.iterrows():
        print(index)
        dict_row = row.to_dict()
        print(dict_row)
        dict_list.append(dict_row)
        print("--------------------------------------------------")

    with open(jsonpath, mode="a") as f:
        f.write(json.dumps(dict_list, ensure_ascii=False))
```

## demo.json

```json
[
    {
        "id": 1001,
        "name": "Tomy",
        "age": 12,
        "gender": "female"
    },
    {
        "id": 1002,
        "name": "Lucy",
        "age": 14,
        "gender": "female"
    }
]
```

## demo.csv

```
id,name,age,gender
1001,Tomy,12,female
1002,Lucy,14,female
```