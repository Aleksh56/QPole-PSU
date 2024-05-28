FROM node:18

WORKDIR /app

COPY . /app/

RUN npm install

RUN chmod +x /start.sh

CMD ["/start.sh"]