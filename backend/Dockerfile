# 1. Use the official Node image
FROM node:20-slim

# 2. Create the app directory inside the container
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your backend code
COPY . .

# 5. The port your Express server listens on
EXPOSE 4000

# 6. Command to start your server
CMD ["node", "server.js"]