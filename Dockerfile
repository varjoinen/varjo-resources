#
# --- Base image ---
#
FROM node:12-alpine AS base

WORKDIR /opt/app
COPY package*.json ./

#
# --- Deps ---
#
FROM base AS deps

RUN npm set progress=false               && \
    npm config set depth 0               && \
    npm install --only=production        && \
    cp -R node_modules prod_node_modules && \
    npm install

#
# --- Test ---
#
FROM deps AS test

RUN apk add --no-cache bash

COPY . .
RUN npm run lint                         && \
    npm run tests-with-coverage

#
# --- Release ---
#
FROM base AS release

COPY --from=deps /opt/app/prod_node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]

