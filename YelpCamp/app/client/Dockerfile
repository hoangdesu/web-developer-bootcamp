# FROM node:16
# WORKDIR /app
# COPY package.json .
# COPY . .
# RUN yarn install
# EXPOSE 5173
# CMD ["yarn","start"]

FROM node:16
WORKDIR /app
COPY package.json .
RUN yarn install
RUN yarn add global vite
COPY . .
# EXPOSE 5173
# CMD ["yarn","start"]

EXPOSE 5174
CMD ["yarn","start:prod"]
