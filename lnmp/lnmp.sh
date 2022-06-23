# !/bin/bash
#Program function:lnmp install & configuration
		
# --- NignxPort ---
FORWARDED_PORT=8080

# --- Mysql ---
DB_USER="root"
DB_PASSWORD="13245413324"
DB_NAME="oswork1"

# --- Application settings ---
APP_HOST="localhost"

echo "Environment: "

echo "~~~~~~~~~~~~~~ Package Repositories ~~~~~~~~~~~~~~"
yum install -y epel-release
yum update -y
#nginx的依赖
yum -y install gcc gcc-c++ make libtool zlib zlib-devel openssl openssl-devel pcre pcre-devel

echo "~~~~~~~~~~~~~~ Install Git, and Wget,yum-utils ~~~~~~~~~~~~~~"
yum install -y wget git yum-utils

echo "~~~~~~~~~~~~~~ Install NodeJS ~~~~~~~~~~~~~~"
wget https://nodejs.org/dist/v16.13.1/node-v16.13.1-linux-x64.tar.xz
tar xvf node-v16.13.1-linux-x64.tar.xz
#创建软链接，以便可以在任意目录下使用 node 和 npm 命令
ln -sf /root/node-v16.13.1-linux-x64/bin/node /usr/local/bin/node
ln -sf /root/node-v16.13.1-linux-x64/bin/npm /usr/local/bin/npm
chmod u+x node-v16.13.1-linux-x64.tar.xz
node -v
npm -v
npm install -g cnpm --registry=https://registry.npm.taobao.org
ln -s /root/node-v16.13.1-linux-x64/bin/cnpm /usr/local/bin/cnpm

echo "~~~~~~~~~~~~~~ Install Nginx ~~~~~~~~~~~~~~"
wget -c https://nginx.org/download/ nginx-1.18.0.tar.gz
tar -zxvf nginx-1.18.0.tar.gz
cd nginx-1.18.0
#需要SSL,开启解压缩静态文件gzip_static on
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module --with-http_gzip_static_modul
make
make install
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
		
echo "~~~~~~~~~~~~~~ Install MySQL ~~~~~~~~~~~~~~"
wget https://repo.mysql.com/mysql57-community-release-el7.rpm && rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
 
yum-config-manager --disable mysql80-community
yum-config-manager --enable mysql57-community

yum -y install mysql57-community-release-el7.rpm
yum install -y mysql-community-server

systemctl start mysqld.service
		
echo "~~~~~~~~~~~~~~ Install PHP ~~~~~~~~~~~~~~"
wget http://rpms.remirepo.net/enterprise/remi-release-7.rpm && rpm -Uvh remi-release-7.rpm
yum-config-manager --enable remi-php71
yum update -y
yum install -y php-fpm php-cli php-pdo php-mysqlnd php-xml php-soap php-gd php-mbstring php-zip php-intl php-mcrypt php-opcache
		
echo "~~~~~~~~~~~~~~ Install Composer ~~~~~~~~~~~~~~"
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && php composer-setup.php
php -r "unlink('composer-setup.php');"
mv composer.phar /usr/bin/composer
		
echo "~~~~~~~~~~~~~~ Enable Installed Services ~~~~~~~~~~~~~~"
systemctl start mysqld php-fpm nginx 	#立即启动服务
systemctl enable mysqld php-fpm nginx 	#设置为开机启动

echo "Configuration:"

echo "~~~~~~~~~~~~~~ Security Configuration ~~~~~~~~~~~~~~"
sed -i 's/SELINUX=enforcing/SELINUX=permissive/g' /etc/selinux/config
setenforce permissive

echo "~~~~~~~~~~~~~~ Mysql Configuration ~~~~~~~~~~~~~~"
echo "[client]" >> /etc/my.cnf #Change MySQL Configuration
echo "default-character-set = utf8mb4" >> /etc/my.cnf
echo "" >> /etc/my.cnf
echo "[mysql]" >> /etc/my.cnf
echo "default-character-set = utf8mb4" >> /etc/my.cnf
echo "" >> /etc/my.cnf
echo "[mysqld]" >> /etc/my.cnf
echo "character-set-server = utf8mb4" >> /etc/my.cnf
echo "collation-server = utf8mb4_general_ci" >> /etc/my.cnf

systemctl restart mysqld.service
		
MYSQL_INSTALLED_TMP_ROOT_PASSWORD=$(grep 'temporary password' /var/log/mysqld.log | awk '{print $NF}') #Change Mysql Password for root
mysqladmin --user=root --password=$MYSQL_INSTALLED_TMP_ROOT_PASSWORD password $DB_PASSWORD
		
mysql -uroot -p$DB_PASSWORD -e "CREATE DATABASE $DB_NAME"
mysql -uroot -p$DB_PASSWORD -e "GRANT ALL PRIVILEGES ON $DB_NAME.* to '$DB_USER'@'localhost' identified by '$DB_PASSWORD'"
mysql -uroot -p$DB_PASSWORD -e "FLUSH PRIVILEGES"

grant all privileges on *.* to 'root'@'%' identified by '13245413324' with grant option;
		
echo "~~~~~~~~~~~~~~ PHP Configure ~~~~~~~~~~~~~~"
sed -i 's/user = apache/user = nginx/g' /etc/php-fpm.d/www.conf
sed -i 's/group = apache/group = nginx/g' /etc/php-fpm.d/www.conf
sed -i 's/;catch_workers_output/catch_workers_output/g' /etc/php-fpm.d/www.conf
sed -i 's/memory_limit = [0-9MG]*/memory_limit = 1G/g' /etc/php.ini
sed -i 's/;realpath_cache_size = [0-9MGk]*/realpath_cache_size = 4M/g' /etc/php.ini
sed -i 's/;realpath_cache_ttl = [0-9]*/realpath_cache_ttl = 600/g' /etc/php.ini
sed -i 's/opcache.enable=[0-1]/opcache.enable=1/g' /etc/php.d/10-opcache.ini
sed -i 's/;opcache.enable_cli=[0-1]/opcache.enable_cli=0/g' /etc/php.d/10-opcache.ini
sed -i 's/opcache.memory_consumption=[0-9]*/opcache.memory_consumption=512/g' /etc/php.d/10-opcache.ini
sed -i 's/opcache.interned_strings_buffer=[0-9]*/opcache.interned_strings_buffer=32/g' /etc/php.d/10-opcache.ini
sed -i 's/opcache.max_accelerated_files=[0-9]*/opcache.max_accelerated_files=32531/g' /etc/php.d/10-opcache.ini
sed -i 's/;opcache.save_comments=[0-1]/opcache.save_comments=1/g' /etc/php.d/10-opcache.ini

mkdir /usr/share/nginx/html/web/

touch /usr/share/nginx/html/web/index.php

cat > /usr/share/nginx/html/web/index.php <<____PHPHELLO
<?PHP
	echo "PHP is the best language for web programming, but what about other languages?";

____PHPHELLO
		
systemctl restart php-fpm

echo "~~~~~~~~~~~~~~ Nginx Configure ~~~~~~~~~~~~~~"
cat > /usr/local/nginx/conf/nginx.conf <<____NGINXHELLO

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


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
____NGINXHELLO
		
/usr/local/nginx/sbin/nginx -s reload

echo "**********************************************************************************************************************"
echo "************** Congratulations! You’ve Successfully **********************************"
echo "**********************************************************************************************************************"
echo "************** Now! Open the homepage http://$APP_HOST:$FORWARDED_PORT/ . **************"
