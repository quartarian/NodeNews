FROM node:boron
MAINTAINER Matthew Bender <quartarian@gmail.com>

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
EXPOSE 8000

# Bundle app source
COPY . /usr/src/app

CMD [ "npm", "start" ]
