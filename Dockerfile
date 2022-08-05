FROM node:16.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g npm@8.1.4
RUN npm cache clean -f && npm install
COPY . .
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm run build
FROM nginx:alpine
COPY --from=0 /usr/src/app/build/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]