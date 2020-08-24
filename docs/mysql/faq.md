# Mysql常见问题指南

## mysql is not allowed to connect to this MySQL server

- 2020.08.24

Q: 当我们在本地登录远程的数据库的时候,比如登录远程腾讯云上的数据库,我们已经开启了`mysql服务`,也打开了对应的端口,但是还会报错这个问题,是由于`mysql安装后不允许远程访问`导致的。

A: 

1. 执行 `mysql -u root -p`，然后输入密码登陆mysql

2. 使用指定账户和密码从任何主机连接到mysql服务器。

```mysql
mysql > GRANT ALL PRIVILEGES ON *.* TO 'myuser'@'%' IDENTIFIED BY 'mypassword' WITH GRANT OPTION;
```
3. 执行：`FLUSH PRIVILEGES`;

```mysql
mysql > FLUSH PRIVILEGES;
```

4. 执行完毕后可以使用刚才授权的账户进行远程登录操作数据库了。
