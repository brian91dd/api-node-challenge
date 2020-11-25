# Nodejs Express Api REST - challenge

## Requirements

- Nodejs v12.20.0 (earliest tested node version)
- Mongodb v4.4.2

## Configuration

For development copy .env.example to .env.development

```
MONGODB_HOST=This is the mongodb url
PORT=Port where the app will be running
SLACK_TOKEN=Slack token to send messages
```

## Running locally

```
npm install
npm start
```

## Test

For testing you will need to copy .env.example to .env.test

```
MONGODB_HOST=This is the mongodb url
PORT=Port where the app will be running
SLACK_TOKEN=Slack token to send messages (empty if you don't want tests to send messages)
```

Then run

```
npm run test
```

