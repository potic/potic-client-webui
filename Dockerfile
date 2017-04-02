FROM node:7.8-onbuild

ENV NODE_ENV --quiet

EXPOSE 8000

CMD [ "npm", "run", "serve:dist" ]
