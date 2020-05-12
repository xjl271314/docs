# 插入相关

## mysql 如果数据不存在，则插入新数据，否则更新的实现方法

1.  key存在则更新，不存在则插入，采用以下sql语句可以实现：

```sql
insert into table_name set my_key=1,value='a',value=1 on duplicate key update value=value+1; 
```

2. 不过在大并发量的数据操作时,可能有时一个有主键的select查询耗时较长，如果对旧数据不关心，可以采用先`disable`即删除原来`my_key=1`的数据，再插入新的数据。

使用`replace`一个语句可以完成上述操纵流程的功能,其语法与`insert`差不多。可以写为:`replace into table_test set ikey=1,value='a',icount=0;`则表中有my_key=1时，先删除旧数据，然后插入新数据.否则直接插入数据,sql语句如下：

```sql
replace into table_test set ikey=1,value='a',icount=0;
```

需要注意的是：如果表中有多个唯一索引，例如：`my_key`和`value`字段都是`unique key`，`replace`会把所有与其唯一索引值相同的数据项删除，再插入新记录。

如表中有两个记录，`replace into table_test set my_key=5,value='c',count=0;`会将两条数据同时删除再插入；
