FROM node:18

WORKDIR /app

COPY . /app/

RUN npm install

RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
