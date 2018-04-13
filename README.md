# Setup

You will need MongoDB in order to develop and run this project. Make sure you have it installed or you will be very much out of luck, unless you want to make a Postgres-enabled fork.

## Install Dependencies

1. Install Dependencies
  `npm install`

The following scripts are used to help with dev and deployment

Building
build:client-local
Makes a build of the react client. This is for local testing and not deployment. It is recommended not to use this directly, as it is included in build:all-local

Starting the API & React Front End
Development
start
Uses the concurrency package to run mongod > server-dev > client-dev. This is the most likely way you will work with this repo.

start:dev
Starts the server located in the built app.
