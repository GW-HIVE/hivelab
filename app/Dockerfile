FROM nginx:1.21.0-alpine as production

ENV NODE_ENV production

RUN mkdir -p /data/shared/hivelab

RUN ln -s /data/shared/hivelab /usr/share/nginx/html/data

RUN ln -s /data/shared/hivelab/downloads /usr/share/nginx/html/downloads

RUN ln -s /data/shared/hivelab/ftp /usr/share/nginx/html/ftp

COPY ./build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
