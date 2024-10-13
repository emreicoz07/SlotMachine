
# Casino Web Application - Backend

This project is the backend part of a web application that allows users to play virtual casino games. This document contains information about the setup, API endpoints, and other details of the backend.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Tests](#tests)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and login
- Token-based authentication (JWT)
- User balance management
- Reading game data from a JSON file
- Testing with Jest
- PostgreSQL integration with Sequelize

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/emreicoz07/SlotMachine/tree/fea0bbfcb847725e66a01cdc5b1cc215d20b2a09/backend
   ```

2. **Install Dependencies:**
   Navigate to the project directory and install necessary dependencies:
   ```bash
   cd backend
   npm install
   ```

3. **Database Setup:**
   Make sure PostgreSQL is installed, and create your database. Then, run migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```

4. **Run the Backend:**
   To run the application in development mode:
   ```bash
   npm run dev
   ```

   To run in production mode:
   ```bash
   npm run start
   ```

## Environment Variables

The following variables should be defined in a `.env` file for the application to run:

```
DATABASE_URL="postgresql://gaming_db_u3or_user:6Tohe3yh8ArzzFgTDqBiW2FmHWWYhnFg@dpg-cs4il25svqrc738d0rg0-a.frankfurt-postgres.render.com/gaming_db_u3or"
JWT_SECRET=mysecretkey
FRONTEND_URL="https://slotmachine-frontend-6hwz.onrender.com"
```

## API Endpoints

### User Registration
- URL: `POST /api/auth/register`
- Description: Registers a new user.
- Request:
  ```json
  {
    "email": "example@mail.com",
    "password": "sixdigit"
  }
  ```

### User Login
- URL: `POST /api/auth/login`
- Description: Logs in an existing user.
- Request:
  ```json
  {
    "email": "emre@gmail.com",
    "password": "111111"
  }
  ```

### Game Data
- URL: `GET /api/games`
- Description: Returns game data in JSON format.

## Database

This project uses PostgreSQL. The database schema includes:
- **Users**: Stores user account information (email, password).
- **Games**: Casino game information is read from a JSON file.

## Contributing

If you would like to contribute, please submit a pull request or open an issue. Contributions are welcome! 

EMRE ICOZ 13-10-2024


