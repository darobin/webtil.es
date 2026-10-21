# Built and run on the supramundane server by `sm deploy` (see README.md).
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
# Trust store: current Alpine CA bundle, and Node verifying against it instead
# of its own bundled roots (sm README, "Trust store").
RUN apk add --no-cache --upgrade ca-certificates-bundle
ENV NODE_OPTIONS=--use-openssl-ca
ENV PORT=1503
EXPOSE 1503
CMD ["node", "index.js"]
