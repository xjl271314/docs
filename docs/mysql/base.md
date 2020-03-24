# 常用基本操作

1. 更改root密码
```sql
mysqladmin -uroot password 'yourpassword'
```

2. 远程登陆mysql服务器
```sql
mysql -uroot -p -h192.168.137.10 -P3306
```

3. 查询数据库
```sql
show databases;
```

4. 进入某个数据库
```sql
use databasename;
```

5. 列出数据库中的表
```sql
show tables;
```

6. 查看某个表全部字段
```sql
desc slow_log;
# 不仅可以显示表信息，还可以显示建表语句
show create table slow_log\G; 
```

7. 查看当前用户
```sql
select user();
```

8. 查看当前所在数据库
```sql
select database();
```

9. 创建新数据库（可以指定字符集）
```sql
create database db1 charset utf8;
```

10. 创建新表
```sql
create table t1 (`id` int(4), `name` char(40));
```

11. 查看数据库版本
```sql
select version();
```

12. 查看数据库状态
```sql
show status;         # 当前会话状态
show global status;  # 全局数据库状态
show slave status\G;   # 查看主从数据库状态信息
```

13. 查询数据库参数
```sql
show variables;
```

14. 修改数据库参数
```sql
show variables like 'max_connect%';
set global max_connect_errors = 1000; # 重启数据库会失效，要在配置文件中修改
```

15. 查看当前数据库队列
```sql
show processlist;
```

16. 创建普通用户并授权给某个数据库
```sql
grant all on databasename.* to 'user1'@'localhost' identified by '123456';
```

17. 查询表数据
```sql
select * from mysql.db;           # 查询该表中的所有字段
select count(*) from mysql.user;  # count(*)表示表中有多少行
select db,user  from mysql.db;    # 查询表中的多个字段
select * from mysql.db where host like '10.0.%'; # 在查询语句中可以使用万能匹配 “%”
```

18. 插入一行数据
```sql
insert into db1.t1 values (1, 'abc');
insert into db1.t1 set id = 22;
```

19. 更改表的某一行数据
```sql
update db1.t1 set name='aaa' where id=1;
```

20. 清空表数据
```sql
truncate table db1.t1;
```

21. 删除表
```sql
drop table db1.t1;
```

22. 清空数据库中的所有表（数据库名是eab12）
```sql 
mysql -N -s information_schema -e "SELECT CONCAT('TRUNCATE TABLE ',TABLE_NAME,';') FROM TABLES WHERE TABLE_SCHEMA='eab12'" | mysql -f eab12
```

23. 删除数据库
```sql
drop database db1;
```

24. 数据库备份
```sql
mysqldump  -uroot -p'yourpassword' mysql >/tmp/mysql.sql
```

25. 数据库恢复
```sql
mysql -uroot -p'yourpassword' mysql </tmp/mysql.sql
```

26. 新建普通用户
```sql
CREATE USER name IDENTIFIED BY 'ssapdrow';
```

27. 更改普通用户密码
```sql
SET PASSWORD FOR name=PASSWORD('fdddfd');
```

28. 查看name用户权限
```sql
SHOW GRANTS FOR name;
```

29. 脚本中执行mysql命令
```sql
mysql -uuser -ppasswd -e"show databases"
echo "show databases"|mysql -uuser -ppassword
# 以下是执行大量mysql语句采用的方式
mysql -uuser -hhostname -ppasswd <<EOF
mysql语句
EOF
```