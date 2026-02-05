FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Устанавливаем зависимости
RUN npm install
COPY . .
# Собираем TS в JS (папка dist)
RUN npm run build
RUN npm prune --production

EXPOSE 4000
# Запускаем из папки dist 
CMD ["node", "dist/index.js"]