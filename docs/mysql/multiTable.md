## 子查询插入

```sql
insert into t2 (column1, column2)
    select column1, column2 from t1 where ...
```

## 简单更新

```sql
update table
    set column1=column1*0.1
        where ...
```

## 删除

```sql
delete from table where ...
```
