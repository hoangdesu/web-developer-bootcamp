FROM node:16

WORKDIR /app/client

COPY package.json .

RUN npm install --legacy-peer-deps

RUN npm install -g vite

COPY . .

EXPOSE 5173

CMD [ "yarn", "run", "start:dev:docker" ]