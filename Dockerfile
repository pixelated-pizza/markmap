# =========================================
# Stage 1: Frontend Build (Vite + Vue + PrimeVue)
# =========================================
FROM node:20 AS frontend
WORKDIR /app

# Pass Firebase env vars into frontend build
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

# Copy package.json & package-lock.json first (Docker cache optimization)
COPY package*.json ./

# Install Node dependencies (Vue, PrimeVue, PrimeIcons, Firebase, etc.)
RUN npm install

# Copy the rest of frontend code
COPY . .

# Build frontend assets (Vite bundles PrimeVue & PrimeIcons)
RUN npm run build

# =========================================
# Stage 2: Backend PHP (Laravel)
# =========================================
FROM php:8.2-fpm
WORKDIR /var/www/html

# Install system dependencies for Laravel
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy Laravel project files
COPY . .

# Copy built frontend assets from frontend stage
COPY --from=frontend /app/public/build /var/www/html/public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Expose PHP-FPM port
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]