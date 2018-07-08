FROM node:8.11.3-alpine
COPY ./package.json /app
COPY ./package-lock.json /app
COPY ./yarn.lock /app
RUN npm install
COPY ./ /app
RUN npm run build
RUN rm -rf ./node_modules
RUN npm install --production