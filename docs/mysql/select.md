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