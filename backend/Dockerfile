ARG NODE_VERSION=22-alpine

# Use a lightweight Node.js image for development
FROM node:${NODE_VERSION} AS dev

WORKDIR /app

COPY package.json package-lock.json* ./

RUN --mount=type=cache,target=/root/.npm npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]