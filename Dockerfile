FROM node:23.7.0
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3093

CMD ["npm", "start"]
