FROM node:8.1.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY . /usr/src/app

ENV ENVIRONMENT_NAME test
CMD [ "sh", "-c", "npm run serve:$ENVIRONMENT_NAME" ]
