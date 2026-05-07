# Stage 1: Build (Notice the "AS build" - this is the name you were missing)
FROM node:alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


RUN npm run build


FROM nginx:stable-alpine


COPY --from=build /app/dist /usr/share/nginx/html


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]