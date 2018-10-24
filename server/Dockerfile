FROM edyan/php:7.2-sqlsrv

# Setup the Docker and Apache profiles
ARG DEBIAN_FRONTEND=noninteractive
USER root
ENV APACHE_RUN_USER root
ENV APACHE_RUN_GROUP root
ENV APACHE_LOG_DIR /var/log/apache2

# Install Docker
RUN apt-get update && apt-get install -y --no-install-recommends apt-utils
RUN apt-get install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
RUN echo "deb [arch=amd64] https://download.docker.com/linux/debian stretch stable" | tee -a /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce
RUN mkdir /src && chmod 0777 /src

# Install Composer
RUN curl https://getcomposer.org/composer.phar --output /usr/local/bin/composer
RUN chmod +x /usr/local/bin/composer && /usr/local/bin/composer self-update

# Install HTTPD
RUN apt-get install -y apache2 libapache2-mod-php7.2
RUN a2enmod php7.2
RUN a2enmod rewrite
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# GO!
EXPOSE 80
CMD ["bash", "-c", "cd /var/www/html && composer install && apache2ctl start"]

##
## Please note that `service docker start` must be invoked with `docker run --privileged`!
##
