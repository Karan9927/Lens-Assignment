# Lens-Assignment

## Project Description

Lens-Assignment is a user authentication and management system built with Node.js and Express. It provides RESTful API endpoints for user registration, login, logout, and profile management. The project uses JWT-based authentication and MongoDB for data storage.

## Table of Contents

- [Installation](#installation)
- [API Endpoints](#api-endpoints)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Lens-Assignment.git
   cd Lens-Assignment
2. Install Dependencies
   ```bash
   npm install
3. Create .env file
   ```bash
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=your_port_number (optional, default is 3000)
4. Start the server
   ```bash
   npm start
   
## API Endpoints {#api-endpoints}
### Register a New User

**URL:** `/api/users/register`

**Method:** `POST`


**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```
**Responses:**

- `201 Created` - User registered successfully.
-  - **Content:**
      ```json
      {
        "message": "Registration successful!",
        "token": "string"
      }
      ```
- `400 Bad Request` - Missing or invalid request parameters.

### User Login

**URL:** `/api/users/login`

**Method:** `POST`


**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Responses:**

- `200 OK` - User logged in successfully.
-  - **Content:**
      ```json
      {
      "User Token": "string"
        "message": "Login Successfull"
      }
      ```
- `401  Unauthorized` - Invalid email or password.

### User Logout

- **URL:** `/api/users/logout`
- **Method:** `POST`
- **Security:** Requires a valid authentication token (`Bearer` token).
- **Responses:**
  - `200 OK`
  -  - **Content:**
      ```json
      {
        "message": "Logout Successful"
      }
      ```
  - `401 Unauthorized` - User not authenticated.
### User Profile

Retrieves the profile information of the authenticated user.

- **URL:** `/api/users/profile`
- **Method:** `GET`
- **Security:** Requires a valid authentication token (`Bearer` token).
- **Responses:**
  - `200 OK` - User profile retrieved successfully.
    - **Content:**
      ```json
      {
        "username": "string",
        "email": "string"
      }
      ```
  - `401 Unauthorized` - User not authenticated.
 
  
This GitHub repository is part of a hiring assignment to showcase my skills and experience. I hope you find it insightful and look forward to discussing further opportunities with your team.
