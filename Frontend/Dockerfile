# ---------- Dev stage ----------
FROM node:18-alpine AS dev
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

ENV HOST=0.0.0.0         
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 5173               
CMD ["npm", "run", "dev"]

# ---------- Prod build ----------

FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
