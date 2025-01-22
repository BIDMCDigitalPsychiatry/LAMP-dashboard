FROM node:20.11
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g npm@10.8.2
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /usr/src/app/build/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
