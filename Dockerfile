# Built and run on the supramundane server by `sm deploy` (see README.md).
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV PORT=1503
EXPOSE 1503
CMD ["node", "index.js"]
