本项目在genal-chat的基础上进行改进优化
采用npm进行包管理，
前端使用Vue框架，后端使用nestjs框架，
相关技术栈包括：
0.Vue

1.Antd for Vue

2.Axios

3.ESLint

4.NestJS

5.TypeORM

6.Nodemailer

7.Websocket + Socket.io

8.JWT + token

9.RxJS

##开发环境
Idea、VisualStudio、Python3
- Idea作为基本开发环境
- VisualStudio需要C++环境，用于邮件发送模块
- Python用于npm包管理，另：邮件发送模块（nodemail）需要用到Python3以上的版本

#部署注意事项
1.附件存储位置需更改到deploy下

2.服务器至少放行3000，80，1997，3306端口

3.nginx.conf终http{}替换为以下内容
```js
http {
  #避免mime类型丢失导致css样式无法正常加载
  include mime.types;
  #nginx开启gzip
  #前端文件在build的时候已经配置好压缩,需要再配置一下nginx;
  gzip on; 
  gzip_static on;
  gzip_buffers 4 16k;
  gzip_comp_level 5;
  gzip_types text/plain application/javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg 
              image/gif image/png;
  
  #nginx请求级别配置
  server {
    listen       80;
    server_name  www.server.com;
    location / {
      root   html;
      index  index.html index.htm;
      add_header Cache-Control public;
    }
    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
    {
        expires      30d;
    }

    location ~ .*\.(js|css)?$
    {
        expires      12h;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
  }  
}
```

4.前端部署
```js
  npm run build
```
- 生成的文件放进nginx的html下
- 重启nginx
```js
nginx -s reload
```

5.后端部署
- 本地执行
```js
  npm run pkg
```
- 拷贝deploy文件夹到nginx同级目录

- 服务器执行
  ```js
    node deploy/index
  ```

