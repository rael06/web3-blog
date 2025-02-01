FROM node:18.20.6
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3093

CMD ["npm", "start"]
