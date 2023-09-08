FROM node:16
WORKDIR /app
COPY package.json .
COPY . .
RUN yarn install
EXPOSE 5173
CMD ["yarn","start"]