# Base stage
FROM node:lts-alpine AS base
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Install dependencies
RUN npm install --silent

# Add a system library needed by the Prisma engine
RUN apk add --no-cache openssl

COPY prisma ./prisma

# generate prisma client
RUN npx prisma generate

# Copy app source
COPY . .

# Build stage
FROM base AS build
RUN npm run build

# Development stage
FROM base AS development
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "migrate:populate:start_dev"]

# Production stage
FROM build AS production
ENV NODE_ENV=production
# remove devDependencies 
RUN npm prune --production
RUN chown -R node /usr/src/app
USER node
EXPOSE 3000
CMD ["npm", "run", "migrate:start" ]
