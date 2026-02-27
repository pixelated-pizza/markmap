# Stage 1: Build frontend assets
FROM node:20 AS frontend
WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./
RUN npm install

# Copy rest of the frontend/Vue code
COPY . .

# Build assets (Vite)
RUN npm run build

# Stage 2: PHP backend
FROM php:8.2-fpm
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev curl

# PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy Laravel code
COPY . .

# Copy built frontend assets
COPY --from=frontend /app/public/build /var/www/html/public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set environment variables
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID

# Permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE 9000
CMD ["php-fpm"]