# FROM node:16
# WORKDIR /app
# COPY package.json .
# COPY . .
# RUN yarn install
# EXPOSE 5173
# CMD ["yarn","start"]

FROM node:16
WORKDIR /app
# COPY ./package.json ./package.json
# COPY ./public ./public
# COPY ./src ./src
COPY . .
RUN yarn install
EXPOSE 5174
CMD ["yarn","start:prod"]

# production:
# EXPOSE 5174
# CMD ["yarn","start:prod"]

# dev env
# EXPOSE 5173
# CMD ["yarn","start:dev"]