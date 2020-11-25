# Nodejs Express Api REST - challenge

## Requirements

- Nodejs v12.20.0 (earliest tested node version)
- Mongodb v4.4.2

## Configuration

For development copy .env.example to .env.development, write a slack token to SLACK_TOKEN env

```
MONGODB_HOST=mongodb://localhost/challenge
PORT=3000
SLACK_TOKEN=Slack token to send messages
```

if you are using docker, use this setting for MONGODB_HOST `MONGODB_HOST=mongodb://db/database-to-choose-for-dev`

## Running locally

```
npm install
npm start
```

## Running it with docker

```
npm run docker:dev
```

## Test

For testing you will need to copy .env.example to .env.test. Leave slack token empty if you don't want to test slack messages

```
MONGODB_HOST=mongodb://localhost/test
PORT=3000
SLACK_TOKEN=
```

if you are using docker, use this setting for MONGODB_HOST `MONGODB_HOST=mongodb://db/database-to-choose-for-test`

## Running test locally

```
npm run test
```

## Running test with docker

```
npm run docker:dev
```

## API documentation

Once the app is running, API documentation can be access from here `http://localhost:3000/api-docs/`
