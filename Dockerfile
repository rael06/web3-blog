FROM node:23.7.0
WORKDIR /app

COPY .next .
COPY public .
COPY package.json .
COPY next.config.ts .
COPY package-lock.json .

RUN npm install --production

EXPOSE 3093

CMD ["npm", "start"]
