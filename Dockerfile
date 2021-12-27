FROM node:14-slim as build
WORKDIR /src
COPY . ./
RUN npm install
RUN npm build --force
# production environment
FROM nginx:stable-alpine
COPY --from=build /src/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]