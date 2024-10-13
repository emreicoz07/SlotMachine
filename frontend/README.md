
# Casino Web Application - Frontend

This project is the frontend part of a web application that allows users to play virtual casino games. This document contains instructions on setting up the frontend, the main features, and other details.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Pages and Components](#pages-and-components)
- [Styling](#styling)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and login
- Token-based authentication (JWT)
- "Remember Me" functionality for extended session handling
- Game listing with search functionality
- Spin page with slot machine animation
- Password change functionality
- Toast notifications using React Toastify

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/emreicoz07/SlotMachine/tree/fea0bbfcb847725e66a01cdc5b1cc215d20b2a09/frontend
   ```

2. **Install Dependencies:**
   Navigate to the project directory and install necessary dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. **Run the Frontend:**
   To run the application in development mode:
   ```bash
   npm start
   ```

   This will run the app on `http://localhost:3000`.

4. **Build the Application:**
   To build the project for production, use:
   ```bash
   npm run build
   ```

## Environment Variables

Make sure to create a `.env` file in the root of the project and define the following variables:

```
REACT_APP_API_URL=https://slotmachine-w5ff.onrender.com
JWT_SECRET=mysecretkey

```

This will allow the frontend to communicate with your backend API.

## Available Scripts

In the project directory, you can run the following scripts:

- `npm start` - Starts the development server.
- `npm run build` - Builds the application for production.
- `npm run lint` - Lints the code using ESLint.
- `npm run format` - Formats the code using Prettier.

## Pages and Components

The project includes several key pages and components:

- **Register.tsx** - Handles user registration. After successful registration, the user is redirected to the login page.
- **Login.tsx** - Handles user login, including "Remember Me" functionality for session management.
- **SpinPage.tsx** - Contains the logic for the slot machine spin, including displaying random symbols and handling winnings.
- **Games.tsx** - Lists all available games and includes a search functionality.
- **ChangePassword.tsx** - Allows users to change their passwords.

## Styling

CSS files are located in the `src/assets/css` directory. Each page and component has its own dedicated CSS file for styling:

- **Register.css**
- **Login.css**
- **SpinPage.css**
- **Games.css**
- **ChangePassword.css**

## Contributing

If you would like to contribute, please submit a pull request or open an issue. Contributions are welcome!

EMRE ICOZ 13-10-2024
