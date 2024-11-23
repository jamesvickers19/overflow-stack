# Overview

Typescript Express server atop Postgres data store, with API for questions and answers similar to a basic StackOverflow data model. It uses Kysley for Postgres interaction.

Project bootstrapped roughly following: https://blog.logrocket.com/how-to-set-up-node-typescript-express/

ChatGPT was used for some boilerplate generation: `Dockerfile`, `docker-compose.yaml`, `init.sql`.

## Data Modeling

A couple of decisions have been made to improve the representation from the sample data and make it easier to manage:

- Use UUID as primary key. UUID's are generally easier to manage than numerical ids; you can generate them on-the-fly and not have to worry about a number sequence. The example dataset is mapped to this by hashing the `id` number into a UUID, while still capturing the `id` for provenance reasons. The endpoints support referencing entities like questions by this id, though we might prefer to go towards UUID's there as well.
- Use timestamp type instead of creation epoch seconds. This is a more flexible and rich representation of time. Loading the example dataset turns the `creation` epoch seconds into a timestamp, and new entities are made with an automatic Postgres-generated time.

# How to use

Uses a [Makefile](Makefile) for convenience. Some things you can do:

Run the database: `make up`

Load the sample dataset into the database: `make load-data`

Run the server: `make start`

Run the server with hot reloading: `make start-watch`

Build the server: `make build`

## Example API calls

These examples use things from the sample dataset, so you may get errors if that's not loaded.

Retrieve all questions:

```sh
curl -s localhost:3000/questions
```

Get answers for a question by id:

```sh
curl -s localhost:3000/question/68462872/answers
```

Add an answer to a question:

```sh
curl --header "Content-Type: application/json" --request POST -d '{"questionId": 68462872, "answerBody": "body"}' localhost:3000/add-answer-to-question
```

Full-text search on questions and answers:

```sh
curl --header "Content-Type: application/json" --request POST -d '{"query": "reasonable"}' localhost:3000/search
```

# Future Work

## Add tests

Deferred because of time constraints and wanting to not nail things down while design and functionality is evolving.

## Add linting

## Deployment improvement

Containerize the server.

Database does not have real login credentials or accounts.

## Use migration management

Flyway or a tool like it. Currently migrations are just baked into an `init.sql` script.

## Use Continuous Integration

## Users not included

The service has no concept of users, authorization, authentication, etc.
The sample data set also has users but they are not used.
Doing things like creating an answer should attach what user performed that action.

```

```