FROM node
WORKDIR /usr/workspace/adobe-sign
COPY package*.json ./
RUN npm install
COPY ./src ./src
COPY ./public ./public
EXPOSE 18081
CMD [ "npm", "start" ]

