# Database

This project uses MongoDB Atlas as the database.

## Database Collections

The application uses the following MongoDB collections:

- employees
- attendances
- leaves

## Setup

1. Create a MongoDB Atlas cluster.
2. Create a database for the application.
3. Add the MongoDB Atlas connection string to the backend `.env` file.
4. Start the backend server.
5. The required collections will be created automatically by Mongoose when data is added.

## Security

The MongoDB Atlas connection string must not be committed to GitHub.

Use `backend/.env.example` as a template for the required environment variables.