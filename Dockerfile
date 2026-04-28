FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy backend code
COPY backend/ .

EXPOSE 5000

CMD ["node", "server.js"]