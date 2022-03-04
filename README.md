# Storefront API

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

You need the following modules and dependencies installed to run this project:

- docker # to run database on docker
- node # To run the application
- npm # For dependency management

## Installing

Simply, run the following command to install the project dependencies:

npm install

## Setup environment

First, create a .env file with all the required environment variables:

- POSTGRES_PASSWORD="password"
- POSTGRES_USER="postgres"
- POSTGRES_DB="books"
- POSTGRES_TEST_DB="books_test"
- POSTGRES_PORT="5432"
- DATABASE_URL="postgresql://postgres:password@localhost:5432/books"
- SALT_ROUNDS="10"
- JWT_SECRET="thisistopsecret"

Next, start the Postgres server on Docker:

docker-compose up -d

Or you can user postgres local to create database books & books_test:

sudo -u postgres psql

\password

Enter password: password

then

create database books;
create database books_test;

Next, you need to run the database migrations:

db-migrate up

Now, database run on port 5432.

## Running the application

Use the following command to run the application in using node:

npm run start

The application will run on http://localhost:3000/.

Note: i let POST "/users" WITHOUT token required to create new user to help you to authenticate.

## Running the tests

Use the following command to run the unit tests:

npm run test

You may also use the Postman collection present in the repository for testing.
