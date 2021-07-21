FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY *.js ./
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY public/ ./public/
COPY routes/ ./routes/
COPY views/ ./views/

CMD ["npm", "run", "start"]