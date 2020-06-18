FROM node:12-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . .
CMD ["node", "src/server.js"]
EXPOSE 3002