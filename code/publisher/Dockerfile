FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY publisher.js ./
COPY config ./config
ENV SCENARIO=healthy
CMD ["sh", "-c", "node publisher.js ./config/${SCENARIO}.json"]
