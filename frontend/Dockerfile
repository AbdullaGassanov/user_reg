# Stage 1: Сборка кода
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Настройка Nginx
FROM nginx:stable-alpine
# Копируем наш конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Копируем билд фронтенда
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]