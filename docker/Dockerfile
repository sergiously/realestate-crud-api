FROM node:20-alpine AS base

ENV APP_DIR=realestate-crud-api
WORKDIR /usr/src/${APP_DIR}

COPY package*.json ./

RUN npm install

COPY . .


# Lint stage
FROM base as linter

ENV APP_DIR=realestate-crud-api
WORKDIR /usr/src/${APP_DIR}

RUN npm run lint


# Build stage
FROM linter as builder

ENV APP_DIR=realestate-crud-api
WORKDIR /usr/src/${APP_DIR}

RUN npm run build


# Deploy stage
FROM node:20-alpine

ENV TZ=America/Buenos_Aires
ENV APP_DIR=realestate-crud-api

RUN apk update && apk add tzdata bash

WORKDIR /usr/src/${APP_DIR}

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /usr/src/${APP_DIR}/dist ./

ENTRYPOINT ["node", "./app.js"]
