# Build
FROM node:14.18-alpine AS build
WORKDIR /usr/local/service/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Run
FROM nginx:1.20.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/local/service/app/dist/orthodontic-clinic /usr/share/nginx/html
EXPOSE 4200