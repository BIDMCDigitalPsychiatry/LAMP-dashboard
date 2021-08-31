FROM node:14.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm cache clean -f && npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /usr/src/app/build/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
