# Fanby App
## Table of Contents
  - [RESTful API Documentation](https://github.com/NutonFlash/fanby-app/?tab=readme-ov-file#restful-api-documentation)
    - [Base URL](https://github.com/NutonFlash/fanby-app/?tab=readme-ov-file#base-url)
    - [Authentication](https://github.com/NutonFlash/fanby-app/?tab=readme-ov-file#authentication)
    - [Endpoints](https://github.com/NutonFlash/fanby-app/?tab=readme-ov-file#endpoints)
      - [Auth](https://github.com/NutonFlash/fanby-app/?tab=readme-ov-file#1-auth-white_check_mark)
      - [User](https://github.com/NutonFlash/fanby-app/?tab=readme-ov-file#2-user-white_check_mark)
      - [Twitter Accounts](https://github.com/NutonFlash/fanby-app/?tab=readme-ov-file#3-twitter-accounts-white_check_mark)
      - [Proxies](https://github.com/NutonFlash/fanby-app/?tab=readme-ov-file#4-proxies-white_check_mark)
      - [Invoices](https://github.com/NutonFlash/fanby-app/?tab=readme-ov-file#5-invoices-white_check_mark)
      - [Health](https://github.com/NutonFlash/fanby-app/?tab=readme-ov-file#6-health-white_check_mark)
      - [Activation Prices](https://github.com/NutonFlash/fanby-app/?tab=readme-ov-file#7-activation-prices-white_check_mark)
  - [ERM Diagram](https://github.com/NutonFlash/fanby-app/?tab=readme-ov-file#erm-diagram)
## RESTful API Documentation
This document provides details on the endpoints of internal API that are used for client-side interaction.
### Base URL
`https://mywebsite.com/api`

All endpoints are relative to the base URL above.
### Authentication
Authentication is required for certain endpoints. 

You need to include an **Authorization header** with a valid JWT token in such format:

`Authorization: Bearer <token>`.

User Id is automatically exctracted from payload of JWT Token for every authorized request.
### Endpoints
#### 1. Auth :white_check_mark:
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
     - "**timezone**" (required): User timezone.
     - "**referalCode**" (optional): Referal code.

     Request Body:
     ```
     {
      "email": "example@gmail.com",
      "password": "axSDla12apad",
      "timezone": "Asia/Seoul",
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
     
#### 2. User :white_check_mark:
   - **Get User**
     
     `GET /user` - returns an information about user who sent the request.

     This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.
 
     Response:
     ```
     {
      "id": "17",
      "email": "example@gmail.com",
      "referalCode": "DISC2024",
      "activationsLeft": 3,
      "createdAt": "2024-02-12 13:00:00",
      "updatedAt": "2024-03-23 19:20:32",
     }
     ```


#### 3. Twitter Accounts :white_check_mark:

   - **Get All Twitter Accounts**
     
     `GET /twitter-accounts` - returns all twitter account entities owned by the user.

     This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.
    
     Parametres:
       - "**includeProxy**" (optional): Boolean value whether to include proxy binded to the account in the response.
       - "**includeMessages**" (optional): Boolean value whether to include account messages in the response.
       - "**includeState**" (optional): Boolean value whether to include account state in the response.
       - "**includeAccountStats**" (optional): Date range for which to include account stats. Date range is in the format `{startDate,endDate}` where each date is ISOString (e.g. `2024-04-05T00:00:00.036Z,2024-04-06T23:59:59.036Z`)
       - "**includeGroups**" (optional): Boolean value whether to include array of groups used by account in the response.
       - "**includeGroupStats**" (optional): Date range for which to include group stats. Date range is in the format `{startDate,endDate}` where each date is ISOString (e.g. `2024-04-05T00:00:00.036Z,2024-04-06T23:59:59.036Z`)

     Request:

     `GET /twitter-accounts?includeProxy=true&includeState=true&includeAccountStats=2024-04-05T00:00:00.036Z,2024-04-06T23:59:59.036Z`

     Response:
     ```
     [{
      "id": "102",
      "userId": "10",
      "proxyId": "20",
      "username": "NutonFlash",
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
      "proxy": {
        "id": "3",
        "userId": "10",
        "host": "digital.cc",
        "port": 8000,
        "username": "NutonFlashProxy",
        "password": "axSDla12apad",
        "createdAt": "2024-04-06 00:00:00",
        "updatedAt": "2024-04-06 23:00:00",
      },
      "state": {
        "accountId" : "102",
        "isRunning": false,
        "label": "Disabled"
        "details": "The account is in the disabled state."
      }
      "accountStats": [
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
  - **Get Twitter Account**
     
    `GET /twitter-accounts/{id}` - returns twitter account entity by the specified `id`.

    This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.

    Parametres:
      - "**includeProxy**" (optional): Boolean value whether to include proxy binded to the account in the response.
      - "**includeMessages**" (optional): Boolean value whether to include account messages in the response.
      - "**includeState**" (optional): Boolean value whether to include account state in the response.
      - "**includeAccountStats**" (optional): Date range for which to include account stats. Date range is in the format `{startDate,endDate}` where each date is ISOString (e.g. `2024-04-05T00:00:00.036Z,2024-04-06T23:59:59.036Z`)
      - "**includeGroups**" (optional): Boolean value whether to include array of groups used by account in the response.
      - "**includeGroupStats**" (optional): Date range for which to include group stats. Date range is in the format `{startDate,endDate}` where each date is ISOString (e.g. `2024-04-05T00:00:00.036Z,2024-04-06T23:59:59.036Z`)
    Request:

    `GET /twitter-accounts/102?includeState=true&includeAccountStats=2024-04-05T00:00:00.036Z,2024-04-06T23:59:59.036Z&includeGroups=true&includeGroupStats=2024-04-05T00:00:00.036Z,2024-04-06T23:59:59.036Z`

    Response:
    ```
    {
    "id": "102",
    "userId": "10",
    "proxyId": "20",
    "username": "NutonFlash",
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
      "isRunning": true,
      "label": "Running"
      "details": "The account is in the running state. It makes retweets and write messages in automatic mode."
      "createdAt": "2024-04-05 00:00:00",
      "updatedAt": "2024-04-05 19:23:00",
    }
    "accountStats": [
      {
        "id": "13",
        "accountId": "102",
        "activityToday": 23313,
        "retweetsToday": 323,
        "messagesToday": 19,
        "createdAt": "2024-04-05 00:00:00",
        "updatedAt": "2024-04-05 19:23:00",
      }
    ],
    joinAccountGroups: {
      "id": "3",
      "accountId": "102",
      "groupId": "1730563812057895261",
      "isUsed": true,
      "createdAt": "2024-04-05 00:00:00",
      "updatedAt": "2024-04-05 19:23:00",
      "group": {
        "id": "1730563812057895261",
        "name": "The Best Promotion Group",
        "requiredRetweets": 3,
        "usersTotal": 290,
        "usersFollowersTotal": 90231,
        "usersActivityRate": 68,
        "rating": 4,
        "bestStartTime": "13:00:00",
        "bestEndTime": "17:00:00",
        "createdAt": "2024-04-05 00:00:00",
        "updatedAt": "2024-04-05 19:23:00",
      },
      "accountGroupStats": [
        {
          "id": "12",
          "joinId": "3",
          "activityToday": 312321,
          "retweetsToday": 90,
          "messagesToday": 23,
          "createdAt": "2024-04-05 00:00:00",
          "updatedAt": "2024-04-05 19:23:00",
        }
      ]
    }
    }
    ```   
  - **Create Twitter Account**
     
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
    "accountStats": [
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
  - **Update Twitter Account**
     
    `PUT /twitter-accounts/{id}` - update twitter account entity by the specified `id`.

    This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.
    
    Parametres:
      - "**proxyId**" (optional): Id of the updated proxy to use with the account.
      - "**password**" (optional): Updated account password.
      - "**avatar**" (optional): Updated avatar image string decoded by base64.
      - "**followers**" (optional): Updated number of the account followers.
      - "**posts**" (optional): Updated number of the account posts.
      - "**groupNumber**" (optional): Updated number of groups associated with the account. 
      - "**activityTotal**" (optional): Updated number of seconds the account was in the `Running` state for all time.
      - "**retweetsTotal**" (optional): Updated number of the retweets made by the account for all time.
      - "**messagesTotal**" (optional): Updated number of the messages sent by the account for all time.
      - "**isActivated**" (optional): Updated account state.
      - "**expirationDate**" (optional): Updated expiration date of the account.

    Request Body:
    ```
    {
      "proxyId": "122",
      "password": "axSDla12apad",
      "followers": 20,
      "posts": 4000,
      "groupNumber": 120,
      "isActivated": false,
      "expirationDate": "2024-04-06",
    }
    ```
  - **Delete Twitter Accounts**
     
    `DELETE /twitter-accounts` - delete twitter accounts by the list of ids.

    This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.
    
    Parametres:
      - "**ids**" (required): Array of account ids to delete.
      
    Request:
   
    `DELETE /twitter-accounts?ids=1,12,23,33`

#### 4. Proxies :white_check_mark:
  - **Get All Proxies**
      
      `GET /proxies` - returns all proxy entities owned by the user.

      This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.

      Response:
      ```
      [{
        "id": "3",
        "userId": "10",
        "host": "digital.cc",
        "port": 8000,
        "username": "NutonFlashProxy",
        "password": "axSDla12apad",
        "createdAt": "2024-04-06 00:00:00",
        "updatedAt": "2024-04-06 23:00:00",
      }]
      ```
  - **Bulk Create Proxy**
     
      `POST /proxies` - create and returns proxy entities, if they are not already added.

      This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.
    
      Request Body:
    
      Array of proxy objects to be created.
      ```
      [{
        "host": "digit.cc",
        "port": 8000,
      },
      {
        "host": "digit.cc",
        "port": 8001,
        "username": "BelieverProxy",
        "password": "dasd0ad31ad823a",
      }]
      ```
     Response:
     ```
      [{
        "id": "3",
        "userId": "10",
        "host": "digital.cc",
        "port": 8000,
        "username": "",
        "password": "",
        "createdAt": "2024-04-06 00:00:00",
        "updatedAt": "2024-04-06 00:00:00",
      },
      {
        "id": "4",
        "userId": "10",
        "host": "digital.cc",
        "port": 8001,
        "username": "BelieverProxy",
        "password": "dasd0ad31ad823a",
        "createdAt": "2024-04-06 00:01:00",
        "updatedAt": "2024-04-06 00:01:00",
      }]
     ```    
  - **Update Proxy**
     
    `PUT /proxies/{id}` - update proxy entity by the specified `id`.

    This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.
    
    Parametres:
      - "**host**" (optional): Updated proxy host address.
      - "**port**" (optional): Updated proxy port number.
      - "**username**" (optional): Updated proxy authentication username.
      - "**password**" (optional): Updated proxy authentication password.

    Request Body:
    ```
    {
      "host": "digit.cc",
      "port": 8000,
      "username": "BelieverProxy",
      "password": "34x2nasd",
    }
    ```
  - **Delete Proxies**
     
    `DELETE /proxies` - delete proxies by the list of the specified `ids`.

    This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.
    
    Parametres:
      - "**ids**" (required): Array of proxy ids to be deleted.
      
    Request:
   
    `DELETE /proxies?ids=1,12,23,33`  
  - **Check Proxies Speed**
       
    `POST /proxies/check` - checks the connection speed and availability of proxies specified in the list of `ids`. Results of each proxy are sent via WebSocket.

    This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.
    
    Parametres:
      - "**ids**" (required): Array of proxy ids to be checked.
      
    Request:
   
    `POST /proxies/check?ids=1,12,23,33`
    
    Response:
    ```
    {
      "fastProxies": {
        "label": "Fast proxies",
        "ids": ["2"],
      },
      "mediumProxies": {
        "label": "Medium proxies",
        "ids": ["4"],
      }
      "slowProxies": {
        "label": "Slow proxies",
        "ids": [],
      },
      "notWorkingProxies": {
        "label": "Not working proxies",
        "ids": ["12"],
      }
    }
    ```
    Websocket Message:
    ```
    {
      "type": "proxy_info",
      "data": {
        "proxyId": "2",
        "progress": 77.23,
        "info": {
          "status": "fast",
          "speed": 1000,
        },
      }
    }
    ``` 

#### 5. Invoices :white_check_mark:
  - **Get All Invoices**
      
      `GET /invoices` - returns all invoice entities owned by the user.

      This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.

      Response:
      ```
      [{
        "id": "3",
        "userId": "10",
        "amount": 150,
        "link": "https://plisio.net/invoice/66043debdb94f7010a0a0425",
        "received": 149.9123,
        "currency": "USDT_BSC",
        "status": "Completed",
        "createdAt": "2024-04-06 00:00:00",
        "updatedAt": "2024-04-06 23:00:00",
      }]
      ```
  - **Create Invoice**
     
    `POST /invoices` - create invoice through Plisio API and returns its entity.

    This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.
    
    Parametres:
      - "**priceAmount**" (required): Inoice amount that should be payed by the user.
      - "**actQty**" (required): Quantity of activations that are purchasing.
      - "**orderDesc**" (required): Order description that will be showed for the user in invoice.
      

    Request Body:
    ```
    {
      "priceAmount": 150.0,
      "actQty": 5,
      "orderDesc": "Account Activation x 5",
    }
    ```
    Response:
    ```
    {
    "id": "31",
    "userId": "10",
    "amount": 150.0,
    "actQty": 5,
    "link": "https://plisio.net/invoice/66043debdb94f7010a0a0425",
    "received": 0.0,
    "currency": "USDT_TRC",
    "status": "Created",
    "createdAt": "2024-04-06 00:00:00",
    "updatedAt": "2024-04-06 23:00:00",
    }
    ```
  - **Update Invoice by Plisio**
     
    `POST /invoices/update` - update invoice entity by request from Plisio payment gateway.

    Parametres:
      - "**order_number**" (required): Invoice Id.
      - "**amount**" (required): Updated received amount of crypto.
      - "**currency**" (required): Updated cryptocurrency selected by the user.
      - "**status**" (required): Updated invoice status.
      - "**verify_hash**" (required): Hash to verify that request is legal.

    Request Body:
    ```
    {
      "order_number": "1",
      "amount": 149.23,
      "currency": "TRX",
      "status": "pending",
      "verify_hash": "5d41402abc4b2a76b9719d911017c592",
    }
    ```

#### 6. Health :white_check_mark:
  - **Check Server Availability**
    
      `POST /health/server` - returns status code `200` if the server is available.

  - **Check Database Availability**
    
      `POST /health/database` - returns status code `200` if the database is available.

#### 7. Activation Prices :white_check_mark:
  - **Get All Activation Prices**
    
      `GET /activation-prices` - returns all activation price entities owned by the user.

      This endpoint requires authentication. Include an **Authorization header** with a valid JWT token.

      Response
      ```
      [{
          "id": 1,
          "price": 100,
          "quantity": 1,
          "createdAt": "2024-04-14T17:56:09.000Z",
          "updatedAt": "2024-04-14T17:56:09.000Z"
      },
      {
          "id": 2,
          "price": 95,
          "quantity": 5,
          "createdAt": "2024-04-14T17:56:19.000Z",
          "updatedAt": "2024-04-14T17:56:19.000Z"
      },
      {
          "id": 3,
          "price": 85,
          "quantity": 15,
          "createdAt": "2024-04-14T17:56:26.000Z",
          "updatedAt": "2024-04-14T17:56:26.000Z"
      },
      {
          "id": 4,
          "price": 70,
          "quantity": 25,
          "createdAt": "2024-04-14T17:56:34.000Z",
          "updatedAt": "2024-04-14T17:56:34.000Z"
      },
      {
          "id": 5,
          "price": 50,
          "quantity": 50,
          "createdAt": "2024-04-14T17:56:41.000Z",
          "updatedAt": "2024-04-14T17:56:41.000Z"
      }]
      ```   

## ERM Diagram

![ERM Diagram](https://github.com/NutonFlash/twitter-soft/blob/main/Fanby%20ERM%20Diagram.jpeg)
