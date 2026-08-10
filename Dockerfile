FROM php:8.2-apache

RUN docker-php-ext-install pdo_mysql \
    && a2enmod rewrite

COPY docker/apache/dev.conf /etc/apache2/conf-available/dev.conf
RUN a2enconf dev

EXPOSE 80
