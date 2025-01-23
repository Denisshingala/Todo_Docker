FROM php:8.3-apache AS base

RUN apt-get update && apt-get install -y \
    unzip git zip libpng-dev \
    libzip-dev default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY --chown=www-data:www-data . .

RUN composer install

COPY ./TodoAPI.conf /etc/apache2/sites-available/TodoAPI.conf

RUN a2enmod rewrite

RUN a2ensite TodoAPI.conf

# RUN php bin/console doctrine:migrations:migrate

VOLUME /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
