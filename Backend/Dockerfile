FROM node:18

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install
RUN apt-get update && apt-get install -y default-mysql-client

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]