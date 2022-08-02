# Digital Value Backend Challenge

This repository contains my solution to the challenge.

You can find the original subjects in the [subjects folder](./subjects/).

At first use, install dependencies:

```bash
npm ci
```

Then you have to run migrations and seeds with the following commands:

```bash
npm run migrations
npm run seeds
```

Afterwards, you can start the server with the following command :

```bash
NODE_ENV=development npm start
```
You may write the environment variable NODE_ENV in a `.env` file at root project, following the [.env.template](./.env.template) structure.

You can use the command `npm test` to run all tests (unit, integration and end to end).

Levels are tagged with git.

For the levels 1, 2 and 3 you can access the categories endpoint with the url : [http://localhost:3001/categories](http://localhost:3001/categories).
