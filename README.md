# Employee Attendance Management System

A full-stack web application for managing employee attendance, leave requests, working hours, and employee records.

The system provides separate dashboards and functionality for Employees and HR users.
## Features

### Employee Features

- Employee login
- Employee dashboard
- Daily check-in
- Daily check-out
- Working hours calculation
- Attendance history
- Leave application
- Leave status tracking
- Leave balance tracking
- Employee settings

### HR Features

- HR login
- HR dashboard
- Attendance overview
- Recent attendance records
- Employee management
- Add employees
- Edit employees
- Delete employees
- Leave management
- Approve leave requests
- Reject leave requests

## Technologies Used

### Frontend

- React
- Vite
- React Router
- Axios
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- CORS
- dotenv

### Database

- MongoDB Atlas
## Requirements

Before running the project, make sure the following are installed:

- Node.js
- npm
- MongoDB Atlas account
- Git
- Modern web browser such as Chrome, Edge, or Firefox

## Project Structure

```text
employee-attendance-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── database/
│   └── README.md
│
├── .gitignore
└── README.md
## Backend Setup

Open a terminal and navigate to the backend folder:

```bash
cd backend

npm install

Create a .env file inside the backend folder.

Use .env.example as a template:
Replace the placeholder values with your own MongoDB Atlas connection string and JWT secret.

Start the backend server:
npm start
The backend runs on:

http://localhost:5000 OR https://employee-attendance-management-system-6b2u.onrender.com

## Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
Install the frontend dependencies:

npm install

Start the frontend development server:

npm run dev

The frontend normally runs on:

http://localhost:5173 OR https://employee-attendance-management-system-6b2u.onrender.com

## Database Setup

This project uses MongoDB Atlas as the database.

### Setup Steps

1. Create a MongoDB Atlas account.
2. Create a MongoDB cluster.
3. Create a database for the application.
4. Configure the MongoDB connection string in `backend/.env`.
5. Start the backend server.

The application uses the following collections:

- `employees`
- `attendances`
- `leaves`

The collections are created automatically by Mongoose when data is added.

For additional database documentation, see:

```text
database/README.md

## How to Run the Application

The backend and frontend must be running at the same time.

### Terminal 1 - Backend

```bash
cd backend
npm install
npm start

Terminal 2 - Frontend
cd frontend
npm install
npm run dev

After starting both servers, open the frontend URL in your browser:

http://localhost:5173

The backend API runs on:

http://localhost:5000 OR https://employee-attendance-management-system-6b2u.onrender.com

## Security

The application uses JWT authentication and bcryptjs for password hashing.

Do not upload sensitive information to GitHub, including:

- `.env` files
- MongoDB passwords
- MongoDB connection strings containing credentials
- JWT secrets
- User passwords
- Other private credentials

The actual `.env` file is excluded from Git using `.gitignore`.

The repository contains:

```text
backend/.env.example

## Project Status

The Employee Attendance Management System is a completed full-stack application.

Implemented functionality includes:

- Employee authentication
- HR authentication
- JWT authorization
- Employee dashboard
- HR dashboard
- Attendance management
- Check-in and check-out
- Working-hours calculation
- Attendance history
- Leave application
- Leave approval and rejection
- Leave balance tracking
- Employee management
- Add, edit, and delete employees
- MongoDB Atlas integration
- Protected employee and HR routes
