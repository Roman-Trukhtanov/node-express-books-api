FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY *.js ./
COPY public/ ./public
COPY src/ ./src

CMD ["npm", "run", "start"]