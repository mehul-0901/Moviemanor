FROM node:lts-alpine
EXPOSE 3000

WORKDIR /app
COPY ./client/package.json ./
RUN npm install
COPY ./client ./
RUN ls -l
CMD [ "npm", "start" ]
