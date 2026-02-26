# Use PHP 8 + Composer
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev curl npm

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . .

# Copy production env
COPY .env.production .env

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install Node dependencies and build Vue
ARG VITE_APP_URL
ENV VITE_APP_URL=$VITE_APP_URL
RUN npm install
RUN VITE_APP_URL=$VITE_APP_URL npm run build

# Expose port
EXPOSE 10000

# Run migrations & seed + start PHP server
CMD sh -c "php artisan migrate:fresh --seed --force && php artisan serve --host=0.0.0.0 --port=10000"