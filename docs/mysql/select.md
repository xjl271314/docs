# 查询相关

## union去相同记录查询

```sql
select column1 from table1
union 
select column2 from table2
```

## union all直接聚合查询

```sql
select column1 from table1
union all
select column2 from table2
```

:::warning
1. `column1`与`column2`应有相同的数据类型。当然它们可以相同。
2. `union all`关键字并不去除重复值，如果需要去除，你可以使用`union`替代它。
3. 为什么说`伪集合`呢，因为你并没有去除重复值（没有保证从`table1 select`出来的是不重复，也没有保证`table2`，更没有保证并之后的结果是不重复的）。
:::

## distinct去重复查询

```sql
select distinct 字段名 from 表名；
```

## order by查询结果进行排序

```sql
select * from 表名 order by 字段名 desc；// 降序，从大到小
select * from 表名 order by 字段名 asc；// 升序，asc默认可以不写
```


## 判断产品是否过期，有效期30天
```sql
select * from product where datediff（day, getdate(), productTime）< 30
```
:::tip
`datediff()` 这个函数是取得2个日期之前的差，第一个参数是表示返回的是天数（day），月数（month）、年（year）等等 ；

`getdate（）` 表示取得当前日期
:::

## 分页限制查询

```sql
# 查出符合条件的记录总数
SELECT COUNT(*) from 表名 WHERE  ......;  

# 查询当页要显示的数据
SELECT * FROM 表名  WHERE ...... limit M,N; 

# 但是从 Mysql4.0.0 开始，我们可以选择使用另外一个方式：
SELECT SQL_CALC_FOUND_ROWS * FROM 表名 WHERE ......  limit M, N;
SELECT FOUND_ROWS();
```

:::tip
`SQL_CALC_FOUND_ROWS` 告诉 MySQL 将sql所处理的行数记录下来。

`FOUND_ROWS()` 则取到了这个纪录。

虽然也是两个语句，但是只执行了一次主查询，所以效率比原来要高很多。
:::

`SELECT`语句中经常可能用`LIMIT`限制返回行数。有时候可能想要知道如果没有`LIMIT`会返回多少行，但又不想再执行一次相同语句。那么，在`SELECT`查询中包含`SQL_CALC_FOUND_ROWS`选项，然后执行`FOUND_ROWS()`就可以了：

```sql
SELECT SQL_CALC_FOUND_ROWS * FROM 表名 WHERE id > 100 LIMIT 10;

SELECT FOUND_ROWS();
```

第二个`SELECT`将返回第一条`SELECT`如果没有`LIMIT`时返回的行数。

:::warning
1. 如果在前一条语句中没有使用`SQL_CALC_FOUND_ROWS`选项，`FOUND_ROWS()`将返回前一条语句实际返回的行数。

2. `FOUND_ROWS()`得到的数字是临时的，执行下一条语句就会失效。如果想要这个数字，就要将它保存下来：

```sql
SELECT SQL_CALC_FOUND_ROWS * FROM ... ;

SET @rows = FOUND_ROWS();
```

3. 如果使用 `SELECT SQL_CALC_FOUND_ROWS`，`MySQL`必须计算所有结果集的行数。尽管这样，总比再执行一次不使用`LIMIT`的查询要快多了，因为结果集不需要返回客户端。


4. 当你想要限制查询的返回行数的同时又想得到查询的完整结果集合的行数,但又不想重复执行一次查询,那么`SQL_CALC_FOUND_ROWS and FOUND_ROWS()` 是非常有用的！
:::


## inner join 内连接查询

> INNER JOIN（内连接：inner可以省略），也称为`自然连接`。与select  a.* , b.*   from  表a, 表b where  a.id = b.id  等效，也是内连接（推荐使用join）


:::warning
内连接是从结果中删除其他被连接表中没有匹配行的所有行，所以内连接可能会丢失信息。
:::

### 学生表信息(Students):

ID| Name | Age | City | MajorID
|:-----|:-----| :-----| :-----| :-----| 
101 | Tom | 20 | Beijing | 10
102 | Lucy | 18 | Shanghai | 11

### 专业信息表(Majors):

ID | Name
|:-----|:-----|
10 | English | 
11 | Computer |

```sql
SELECT Students.ID,Students.Name,Majors.Name AS MajorName FROM Students INNER JOIN Majors ON Students.MajorID = Majors.ID
```

### 查询结果:

ID | Name | MajorName
|:-----|:-----|:-----|
101 | Tom | English | 


## LEFT JOIN（左连接）查询

> 结果集保留左表的所有行，但只包含第二个表与第一表匹配的行。第二个表相应的空行被放入NULL值。

```sql
SELECT Students.ID,Students.Name,Majors.Name AS MajorName
FROM Students LEFT JOIN Majors
ON Students.MajorID = Majors.ID
```

### 查询结果:

ID | Name | MajorName
|:-----|:-----|:-----|
101 | Tom | English | 
102 | Lucy | Null | 


## right join (右连接)查询

> 右外连接保留了第二个表的所有行，但只包含第一个表与第二个表匹配的行。第一个表相应空行被入NULL值。

```sql
SELECT Students.ID,Students.Name,Majors.Name AS MajorName
FROM Students RIGHT JOIN Majors
ON Students.MajorID = Majors.ID
```

### 查询结果:

ID | Name | MajorName
|:-----|:-----|:-----|
101 | Tom | English | 
Null | Null | Computer | 

## FULL JOIN (全外连接）查询

> 会把两个表所有的行都显示在结果表中

```sql
SELECT Students.ID,Students.Name,Majors.Name AS MajorName
FROM Students FULL JOIN Majors
ON Students.MajorID = Majors.ID
```

### 查询结果:

ID | Name | MajorName
|:-----|:-----|:-----|
101 | Tom | English | 
102 | Lucy | Null | 
Null | Null | Computer | 

## cross join（交叉连接）查询

> 交叉连接返回左表中的所有行，左表中的每一行与右表中的所有行组合。交叉连接也称作笛卡尔积。 简单查询两张表组合，这是求笛卡儿积，效率最低。

```sql
SELECT Students.ID,Students.Name,Majors.Name AS MajorName
FROM Students CROSS JOIN Majors
```

### 查询结果:

ID | Name | MajorName
|:-----|:-----|:-----|
101 | Tom | English | 
102 | Lucy | English | 
101 | Tom | Computer | 
102 | Lucy | Computer | 