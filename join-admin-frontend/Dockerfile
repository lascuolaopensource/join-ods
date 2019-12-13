FROM node:8 AS builder

WORKDIR /home/root/

ADD . join-admin-frontend/

WORKDIR join-admin-frontend/

RUN npm install \
&& npm run config \
&& npx ng build -prod -aot

FROM nginx

COPY --from=builder /home/root/join-admin-frontend/dist/ /usr/share/nginx/html
COPY ./conf.d/default.conf /etc/nginx/conf.d/
