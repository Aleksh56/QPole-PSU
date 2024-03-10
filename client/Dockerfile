FROM node:18

WORKDIR /app

COPY . /app/

RUN npm install

RUN npm run build

WORKDIR /app/dist

RUN killall node

CMD ["node", "start.js"]
