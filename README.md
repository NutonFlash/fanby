# Fanby App
## RESTful API Documentation
This document provides details on the endpoints of internal API that are used for client-side interaction.
### Base URL
`https://mywebsite.com/api`

All endpoints are relative to the base URL above.
### Authentication
Authentication is required for certain endpoints. 

You need to include an Authorization header with a valid JWT token in such format:

`Authorization: Bearer <token>`.
### Endpoints
**1. Auth**
   - **Login User**
     
     `POST /auth/login` - login user and returns access and refresh tokens.

     Parametres:
     - '**email**' (required): User email.
     - '**password**' (required): User password.

     Request Body:
     ```
     {
      "email": "example@gmail.com",
      "password": "some_password"
     }
     ```
     Response:
     ```
     {
      "accessToken": "encrypted_access_token",
      "refreshToken": "encrypted_refresh_token"
     }
     ```

   - **Register New User**
     
     `POST /auth/register` - register new user and returns access and refresh tokens.

     Parametres:
     - '**email**' (required): User email.
     - '**password**' (required): User password.
     - '**referalCode**' (optional): Referal code.

     Request Body:
     ```
     {
      "email": "example@gmail.com",
      "password": "some_password",
      "referalCode": "EXAMPLE007"
     }
     ```
     Response:
     ```
     {
      "accessToken": "encrypted_access_token",
      "refreshToken": "encrypted_refresh_token"
     }
     ```

   - **Refresh JWT Tokens**
     
     `POST /auth/refresh` - refresh tokens and returns them.
     
     This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.
     
     Parametres:
     - '**email**' (required): User email.
     - '**password**' (required): User password.
     - '**referalCode**' (optional): Referal code.

     Request Body:
     ```
     {
      "email": "example@gmail.com",
      "password": "some_password",
      "referalCode": "EXAMPLE007"
     }
     ```
     Response:
     ```
     {
      "accessToken": "encrypted_access_token",
      "refreshToken": "encrypted_refresh_token"
     }
     ```
     
**2. User**
   - _getUserInfo_
     
     `GET /user/info` - returns an information about user who sent the request.
     
     Response:
     ```
     {
      "userId": 123,
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
     }
     ```
## ERM Diagram
![ERM Diagram](https://github.com/NutonFlash/twitter-soft/blob/main/Fanby%20ERM%20Diagram.png)
