FROM node:lts-alpine
EXPOSE 4000

WORKDIR /app
COPY ./server/package.json ./
RUN npm install
COPY ./server ./
RUN ls -l
CMD [ "npm", "start" ]
