# REST Interface for Lottery System

## The System
This is a simple REST interface for a Lottery System. It has a bunch of endpoints that can be used to interact with the system.
They are as follows:

1. `GET /ticket`

This is the endpoint to fetch all tickets in the system

2. `GET /ticket/{id}`

This is the endpoint to fetch the details of a specific ticket.

3. `POST /ticket`

This is the endpoint to create a ticket. Please note that this endpoint requires a parameter in the body of the request to indicate how many lines need to be generated for the ticket. The param is simply `lines`.

4. `PUT /ticket/{id}`

This is the endpoint to amend the ticket lines. Please note that, similar to the above endpoint, we are expecting the number of lines to be added here as well.

5. `PUT /status/{id}`

This is the endpoint to fetch the status of the ticket. It should be noted that once the status for a particular ticket has been fetched, it can no longer be amended.

## Running the Application

Please install the dependencies and then you can start the server using either `yarn start` or `npm start` command. Once the server is running, you can use the `http://localhost:3000` URL to make calls to various endpoints.

I have also implemented static code analysis through ESLint. In order to run that, simply run the `yarn lint` or `npm run lint` command. And if you do notice any autofixable lint errors, they can be fixed with `yarn lint:fix` or `npm run lint:fix` command.

I have also implemented Unit Testing using Jest. In order to run the tests, you can run the `yarn test` or `npm test` command.

## Databse Design Decisions

Since this application is a lightweight application for the purpose of the assessment, I have decided to implement this application with an in-memory Database, SQLite.

Since we will not be storing a lot of data right now, I believe this should suffice for the time being.

However, in production environment, we will definitely be using a dedicated DB instance.

The ER Diagram is below

![alt text](src\assets\er_diagram.png)

It is a simple design, we have two tables:
1. Lottery - to store the lottery information.
2. Line - to store the information of each line. Each entry in this table will refer to an entry in the Lottery table through the `lotteryId` Foreign Key constraint.