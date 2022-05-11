FROM node:lts-alpine
# EXPOSE 3001

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN ls -l
CMD [ "npm", "start" ]