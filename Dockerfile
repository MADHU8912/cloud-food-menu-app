# Use official Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install --production

# Copy app files
COPY . .

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "server.js"]