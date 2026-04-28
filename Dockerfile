FROM node:20-alpine

# ✅ Add metadata labels
LABEL version="1.0"
LABEL maintainer="nikhilabba12"

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy full project
COPY . .

# Expose app port
EXPOSE 5000

# Start app
CMD ["node", "server.js"]
