FROM edyan/php:7.2-sqlsrv
USER root

# Install Docker
RUN \
	apt-get update && \
	apt-get install -y --no-install-recommends apt-utils && \
	apt-get install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common && \
	curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - \
	&& echo "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable" | tee -a /etc/apt/sources.list.d/docker.list && \
	apt-get update && apt-get install -y docker-ce && \
	usermod -a -G docker root && \
	mkdir /src && chmod 0777 /src

# Install Composer
RUN \
	curl https://getcomposer.org/composer.phar --output /usr/local/bin/composer && \
	chmod +x /usr/local/bin/composer && /usr/local/bin/composer self-update

# Install HTTPD
RUN \
	apt-get install -y apache2 libapache2-mod-php7.2 && \
	phpenmod sqlsrv && phpenmod pdo_sqlsrv && a2enmod php7.2 && a2enmod rewrite && \
	echo "ServerName localhost" >> /etc/apache2/apache2.conf && \
	sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf && \
	apt-get clean && rm -rf /var/lib/apt/lists/*

# Run HTTPD + Composer + PHP
EXPOSE 80 443
CMD \
	chmod 0777 /var/run/docker.sock && chmod 0777 /src && \
	cd /var/www/html && composer install && \
	apache2ctl -D FOREGROUND

##
## -------------
## Sample Usage:
## -------------
##
## ```
## docker run \
##     --rm --privileged \
##     -v /var/www/html:/var/www/html \
##     -v /var/run/docker.sock:/var/run/docker.sock \
##     -v /src:/src \
##     lamp-server
## ```
##
