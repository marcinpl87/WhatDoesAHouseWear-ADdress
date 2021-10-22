#/bin/sh

#https://www.how2shout.com/linux/script-to-install-lamp-wordpress-on-ubuntu-20-04-lts-server-quickly-with-one-command/

#first copy GIT ~/.ssh/id_rsa and ~/.ssh/id_rsa.pub files
#next run ssh-add script
#next run this script

install_dir="/var/www/html"
db_name="db"
db_user="user"
db_password="user"
mysqlrootpass="root"

apt-get update

#### Install Packages for https and mysql
apt -y install apache2 mysql-server curl nodejs git

#### Start http
rm /var/www/html/index.html
systemctl enable apache2
systemctl start apache2

#### Start mysql and set root password
systemctl enable mysql
systemctl start mysql

/usr/bin/mysql -e "USE mysql;"
/usr/bin/mysql -e "UPDATE user SET Password=PASSWORD($mysqlrootpass) WHERE user='root';"
/usr/bin/mysql -e "FLUSH PRIVILEGES;"
touch /root/.my.cnf
chmod 640 /root/.my.cnf
echo "[client]">>/root/.my.cnf
echo "user=root">>/root/.my.cnf
echo "password="$mysqlrootpass>>/root/.my.cnf
####Install lynx and PHP
apt -y install lynx php php-mysql php-gd php-curl php-json npm

sed -i '0,/AllowOverride\ None/! {0,/AllowOverride\ None/ s/AllowOverride\ None/AllowOverride\ All/}' /etc/apache2/apache2.conf #Allow htaccess usage

systemctl restart apache2

####Download and extract latest WordPress Package
if test -f /tmp/latest.tar.gz
then
echo "WP is already downloaded."
else
echo "Downloading WordPress"
cd /tmp/ && wget "http://wordpress.org/latest.tar.gz";
fi

/bin/tar -C $install_dir -zxf /tmp/latest.tar.gz --strip-components=1
chown www-data: $install_dir -R

#### Create WP-config and set DB credentials
/bin/mv $install_dir/wp-config-sample.php $install_dir/wp-config.php

/bin/sed -i "s/database_name_here/$db_name/g" $install_dir/wp-config.php
/bin/sed -i "s/username_here/$db_user/g" $install_dir/wp-config.php
/bin/sed -i "s/password_here/$db_password/g" $install_dir/wp-config.php

cat << EOF >> $install_dir/wp-config.php
define('FS_METHOD', 'direct');
EOF

cat << EOF >> $install_dir/.htaccess
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index.php$ – [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
EOF

chown www-data: $install_dir -R

##### Set WP Salts
grep -A50 'table_prefix' $install_dir/wp-config.php > /tmp/wp-tmp-config
/bin/sed -i '/**#@/,/$p/d' $install_dir/wp-config.php
/usr/bin/lynx --dump -width 200 https://api.wordpress.org/secret-key/1.1/salt/ >> $install_dir/wp-config.php
/bin/cat /tmp/wp-tmp-config >> $install_dir/wp-config.php && rm /tmp/wp-tmp-config -f
/usr/bin/mysql -u root -e "CREATE DATABASE $db_name"
/usr/bin/mysql -u root -e "CREATE USER '$db_user'@'localhost' IDENTIFIED WITH mysql_native_password BY '$db_password';"
/usr/bin/mysql -u root -e "GRANT ALL PRIVILEGES ON *.* TO '$db_user'@'localhost';"

apt -y install phpmyadmin
echo "Include /etc/phpmyadmin/apache.conf" >> /etc/apache2/apache2.conf
service apache2 restart

npm install --global gulp
sudo -u m git clone git@github.com:marcinpl87/WhatDoesAHouseWear-ADdress.git /home/m/WhatDoesAHouseWear-ADdress/
sudo -u m npm install --prefix /home/m/WhatDoesAHouseWear-ADdress/

