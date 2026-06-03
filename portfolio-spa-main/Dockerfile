# Stage 1 : Build React/Vite
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copier TOUT le code source (src/, public/, index.html, vite.config.js...)
COPY . .

RUN npm run build

# Stage 2 : Serveur Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Config Nginx pour React Router (SPA)
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { try_files $uri $uri/ /index.html; } \
    location /api/ { proxy_pass http://backend:5000/api/; } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]