FROM node:20-alpine

WORKDIR /app

# Copy ROOT package.json (not backend)
COPY package*.json ./

RUN npm install --omit=dev

# Copy full project
COPY . .

EXPOSE 5000

CMD ["node", "backend/server.js"]