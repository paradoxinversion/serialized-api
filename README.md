# Setup

You will need MongoDB in order to develop and run this project. Make sure you have it installed or you will be very much out of luck, unless you want to make a Postgres-enabled fork.

## Install Dependencies

1. Install Dependencies
  `npm install`

2. Add a file named `.env` in the `src` folder with the following information to prepare your environment

3. Run the program with `npm start`. Note that concurrently will take care of starting the mongo server when developing. If you are running tests, make sure to manually start a mongod process.

```BASH

DB_HOST=localhost
DB_NAME=serialized_api_dev
TOKEN_SECRET=<InsertYourSecret>
SESSION_SECRET=<InsertYourSecret>
API_PORT=3001

```


## Developing the Project

### start

Uses the concurrency package to run mongod => server-dev => client-dev. This is the most likely way you will work with this repo. When running the project in this manner, project files will be built in-memory by webpack-dev-server. No additional files will be added to the project directory.

### start:dev

Starts the server located in the built app. This method requires the project to be built, such as via `build:all-local`.

### server-dev

Starts the Serialized API only.

### client-dev

Starts the Serialized Client only. 

*Note that without the API, the functionality of the client will be severely limited. Therefore, it is always recommended to use `start` or `start:dev` for the simplest developing experience.*

## Building the Project

### build:client-local

Makes a build of the react client. This is for local testing and not deployment. It is recommended not to use this directly, as it is included in build:all-local

### build:all-deploy
