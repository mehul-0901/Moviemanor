FROM node:lts-alpine
EXPOSE 3000

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN ls -l
CMD [ "npm", "start" ]