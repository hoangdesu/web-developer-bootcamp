FROM node:16

WORKDIR /app/server

COPY package.json .

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 3001

CMD [ "yarn", "run", "start:dev" ]
