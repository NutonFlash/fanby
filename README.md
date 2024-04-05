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
#### 1. Auth
   - **Login User**
     
     `POST /auth/login` - login user and returns access and refresh tokens.

     Parametres:
     - "**email**" (required): User email.
     - "**password**" (required): User password.

     Request Body:
     ```
     {
      "email": "example@gmail.com",
      "password": "axSDla12apad"
     }
     ```
     Response:
     ```
     {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
     }
     ```

   - **Register New User**
     
     `POST /auth/register` - register new user and returns access and refresh tokens.

     Parametres:
     - "**email**" (required): User email.
     - "**password**" (required): User password.
     - "**referalCode**" (optional): Referal code.

     Request Body:
     ```
     {
      "email": "example@gmail.com",
      "password": "axSDla12apad",
      "referalCode": "EXAMPLE007"
     }
     ```
     Response:
     ```
     {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
     }
     ```

   - **Refresh JWT Tokens**
     
     `POST /auth/refresh` - refresh tokens and returns them.
     
     This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.
     
     Parametres:
     - "**refreshToken**" (required): Refresh JWT token.

     Request Body:
     ```
     {
      "refreshToken": "jwt_refresh_token"
     }
     ```
     Response:
     ```
     {
      "accessToken": "new_jwt_access_token",
      "refreshToken": "new_jwt_refresh_token"
     }
     ```
     
#### 2. User
   - **Get User**
     
     `GET /user` - returns an information about user who sent the request.

     This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.
 
     Response:
     ```
     {
      "id": "17"
      "email": "example@gmail.com"
      "hashedPwd": "$2y$10$.sXVEFdzzVVYl0Tj5FPi4.tXOMmLEDb9wh5TqTGuXvJamxMzm4fhG",
      "referalCode": "DISC2024",
      "activationsLeft": 3,
      "createdAt": "2024-02-12 13:00:00",
      "updatedAt": "2024-03-23 19:20:32",
     }
     ```


#### 3. Twitter Accounts
   - **Get All Twitter Accounts**
     
     `GET /twitter-accounts` - returns all twitter accounts owned by the user.

     This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.
    
     Parametres:
       - "**withState**" (optional): Boolean value whether to include state data in the response.
       - "**withGroups**" (optional): Boolean value whether to include array of groups used by account in the response.
       - "**stats**" (optional): Array of stats dates to include in the response.

     Request:

     `GET /twitter-accounts?withState=true&stats=2024-04-05,2024-04-06`

     Response:
     ```
     [{
      "id": "102",
      "userId": "10",
      "proxyId": "20",
      "username": "NutonFlash",
      "password": "axSDla12apad",
      "avatar": "",
      "followers": 202,
      "posts": 1092,
      "groupNumber": 23,
      "activityTotal": 10932132,
      "retweetsTotal": 230,
      "messagesTotal": 49,
      "isActivated": true,
      "expirationDate": "2024-04-30 12:00:00",
      "createdAt": "2024-04-05 02:00:00",
      "updatedAt": "2024-04-05 12:00:00",
      "state": {
        "accountId" : "102",
        "isRunning": false,
        "label": "Disabled"
        "details": "The account is in the disabled state."
      }
      "stats": [
        {
          "id": "13",
          "accountId": "102",
          "activityToday": 23313,
          "retweetsToday": 323,
          "messagesToday": 19,
          "createdAt": "2024-04-05 00:00:00",
          "updatedAt": "2024-04-05 19:23:00",
        },
        {
          "id": "14",
          "accountId": "102",
          "activityToday": 0,
          "retweetsToday": 0,
          "messagesToday": 0,
          "createdAt": "2024-04-06 00:00:00",
          "updatedAt": "2024-04-06 23:00:00",
        }
      ]
     }]
     ```
  - **Create Twitter Account Entity**
     
    `POST /twitter-accounts` - create and returns twitter account entity, if it is not already added, along with account state and stats.

    This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.
    
    Parametres:
      - "**username**" (required): Account username.
      - "**password**" (required): Account password.
      - "**proxyId**" (optional): Id of the proxy selected to use with the account.

    Request Body:
    ```
    {
      "username": "NutonFlash",
      "password": "axSDla12apad",
    }
    ```
     Response:
     ```
     {
      "id": "2",
      "userId": "12",
      "proxyId": null,
      "username": "NutonFlash",
      "password": "axSDla12apad",
      "avatar": "",
      "followers": 0,
      "posts": 0,
      "groupNumber": 0,
      "activityTotal": 0,
      "retweetsTotal": 0,
      "messagesTotal": 0,
      "isActivated": false,
      "expirationDate": "2024-04-05 12:00:00",
      "createdAt": "2024-04-05 12:00:00",
      "updatedAt": "2024-04-05 12:00:00",
      "state": {
        "accountId" : "2",
        "isRunning": false,
        "label": "Disabled"
        "details": "The account is in the disabled state."
      }
      "stats": [
        {
          "id": "1",
          "accountId": "2",
          "activityToday": 0,
          "retweetsToday": 0,
          "messagesToday": 0,
          "createdAt": "2024-04-05 12:00:00",
          "updatedAt": "2024-04-05 12:00:00",
        }
      ]
     }
     ```   
          
## ERM Diagram
![ERM Diagram](https://github.com/NutonFlash/twitter-soft/blob/main/Fanby%20ERM%20Diagram.png)
