FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src
COPY app.js ./

EXPOSE 4000

CMD ["node", "app.js"]