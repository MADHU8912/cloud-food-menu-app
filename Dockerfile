# Use official Node image
FROM node:20

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000

CMD ["node", "backend/server.js"]