FROM node:12 AS build-stage
ENV PATH /eduvault/node_modules/.bin:$PATH

WORKDIR /eduvault/
COPY package*.json ./
RUN npm ci --production

WORKDIR /eduvault/api
COPY ./api/package.json ./
RUN npm i

# WORKDIR /eduvault/app
# COPY ./app/package*.json ./
# RUN npm ci

WORKDIR /eduvault/
COPY . .

FROM build-stage AS prod-stage

WORKDIR /eduvault/
RUN npm run build:api
# build on system so docker does not run out of memory
# RUN npm run build:app
CMD ["npm", "run", "start"]
