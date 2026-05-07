# Stage 1: Build
FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run (No Nginx)
FROM node:alpine
WORKDIR /app
# Copy the entire .output folder
COPY --from=build /app/.output ./.output

# Nitro runs on port 3000 by default
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]