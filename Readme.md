# RESTful API Project

This is a backend application providing a RESTful API for Registration, logic, and getting a List of User(s).

### Installation

The application is built on  [Node.js](https://nodejs.org/) v10.17+.

Install the dependencies and start the server.

```sh
$ npm install
$ npm start
```

Extract the postman collection attached to the email, and request the available routes to test the API.

### Tech Stack

The application is built on top of the below JS libraries:
* [express (v4.17)](https://expressjs.com/): Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. 
* [dotenv (v8.2)](https://www.npmjs.com/package/dotenv): The dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on the Twelve-Factor App methodology. I have used it to store the following configuration variables i.e. DB connection string and a secret string to sign the jwt token with. 
* [jsonwebtoken (v8.5)](https://jwt.io/) JSON Web Tokens are an open, industry-standard RFC 7519 method for representing claims securely between two parties. This is used to authorize the GET requests to list out the user(s) and their details.
* [nodemon (v2.0.7)](https://www.npmjs.com/package/nodemon) Nodemon is a tool that helps develop node. js based applications by automatically restarting the node application when file changes in the directory are detected.
* [@hapi/joi (v15.0.3)](https://www.npmjs.com/package/@hapi/joi) The most powerful schema description language and data validator for JavaScript. Validating data can be very helpful in making sure that your application is stable and secure. Hapi allows this functionality by using the module Joi. Joi is an object schema description language and validator for JavaScript objects, which allows you to create blueprints or schemas for JavaScript objects to ensure validation of key information. 
* [bcryptjs (v2.4.3)](https://www.npmjs.com/package/bcrypt) A library to help you hash passwords. it is a password-hashing function. This is used to hash passwords before storing them into the database system. 
* [mongoose (v5.11.12)](https://mongoosejs.com/) Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. This is used to query the MongoDB database to serve the requests and return its response from DB.

### directory structure
- The entire application is contained within the `app.zip` file.
- `index.js` is an entry point of the application.
- `.env` file contains application configuration.
- `validations.js` contains registeration and login validations.
- `model` contains the MongoDB schemas for `users` and `employees` collection of `test` db
- `routes` contains the internal routes of RestApi.
    - `routes/auth.js` includes public routes of the API for authorization requests of the user i.e. `POST: api/posts/register` and `POST: api/posts/login `.
    - `routes/verifyRoutes.js` contains a function to verify the jwt token to provide an authentication mechanism for private routes of the API.
    - `routes/authenticatedRoutes.js` contains private routes of the API. These routes will serve the user with user-list based on the param/body-data sent along with the request i.e. `api/posts/getEmpoyee/:employeeId` and `api/posts/getUserList`.
 
### Todos

 - Set an expiration time of jwt token, and re-hydrate them according to the ongoing session. 
 - Migrate to Joi as @hapi/Joi is deprecated.
 
## How to consume the REST API?
There are 4 endpoints `/api/user/register`,  `/api/user/login`,  `/api/posts/employeeId/:employeeId`,  `/api/posts/userList`.
There are number of variations in request body to get desired input
- can search an employee and its user_details using `/api/posts/employeeId/:employeeId`
- can search a user and its employee_details using `/api/posts/userList` using first_name and/or last_name. You can also add any sortBy criteria to sort the result.
- can list all the users `/api/posts/userList`. can also add any sortBy criteria and/or Pagination as per requirement. 
- sortBy criteria 
    -  `"sortBy": {"employee_details.organisation_name":-1 }` sort by org name in DESC order
    -  `"sortBy": {"employee_details.employee_id":1 }` sort by emp id in ASC order
    -  `"sortBy": {"first_name":1 }`, similarly you can sort by last_name and email
    where 1 is ASC and -1 is DESC order
- pagination combinations are
    - `pageNo`: get the results of specific page number
    - `size`: It is the number of items in the result per page

Below are a few curl examples to request the API and get their responses. 

### Register a User
Register a user using /api/user/register with the given data. It will create an entry in users and employees collection, and return ids of the inserted rows in respective collections.

`GET /api/user/register`

    curl --location --request POST 'http://localhost:3000/api/user/register' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "first_name": "Tommy",
        "last_name": "Blake",
        "email": "tommy.blake@yahoo.com",
        "password": "tommyblake",
        "organisation_name": "Accenture"
    }'

### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 73
    ETag: W/"49-azHmubzATU+LdbjVdF7pafdLxFk"
    Date: Mon, 18 Jan 2021 16:44:10 GMT
    Connection: keep-alive
    {"user":"6005badac76932272cbd83b1","employee":"6005badac76932272cbd83b2"}

## Login
Send a login request for the newly created user using email id and password fields. It will return the jwt token in response.
### Request

`POST /api/user/login`

    curl --location --request POST 'http://localhost:3000/api/user/login' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "email": "tommy.blake@yahoo.com",
        "password": "tommyblake"
    }'


### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    jwt-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDA1YmFkYWM3NjkzMjI3MmNiZDgzYjEiLCJpYXQiOjE2MTA5ODg1OTJ9.vDkNYhd9cMSqVZZdB6NMoDGeu1VKrl8XQMYrAo8vit4
    Content-Type: text/html; charset=utf-8
    Content-Length: 156
    ETag: W/"9c-/xQlCou2dTPJJa/MTWOmpHY4jS0"
    Date: Mon, 18 Jan 2021 16:49:52 GMT
    Connection: keep-alive
    Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDA1YmFkYWM3NjkzMjI3MmNiZDgzYjEiLCJpYXQiOjE2MTA5ODg1OTJ9.vDkNYhd9cMSqVZZdB6NMoDGeu1VKrl8XQMYrAo8vit4

## Search using employeeId
Search an employee and its user_details by sending employeeId in the query parameter. Attach the jwt token returned in the login call in the request header. 
Note: We can use projections to limit the columns to get specific columns in the response.

### Request

`GET /api/posts/getEmployee/6005badac76932272cbd83b2`

    curl --location --request GET 'http://localhost:3000/api/posts/getEmployee/6005badac76932272cbd83b2' \
    --header 'jwt-token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDA1YmFkYWM3NjkzMjI3MmNiZDgzYjEiLCJpYXQiOjE2MTA5ODg1OTJ9.vDkNYhd9cMSqVZZdB6NMoDGeu1VKrl8XQMYrAo8vit4'

### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 321
    ETag: W/"141-LmKWFJ9O1qCsLC1eDB+eAY4Vw2Y"
    Date: Mon, 18 Jan 2021 16:53:43 GMT
    Connection: keep-alive
    [{"_id":"6005badac76932272cbd83b1","first_name":"Tommy","last_name":"Blake","email":"tommy.blake@yahoo.com","password":"$2a$10$RxJr652xcJgHoh13PiF9Q.BmilwUqBZ4P7d40NrywjJRhF1jwx9/.","__v":0,"employee_details":[{"_id":"6005badac76932272cbd83b2","organisation_name":"Accenture","user":"6005badac76932272cbd83b1","__v":0}]}]


## List user using searching criteria
List all the users meeting the search criteria i.e. users who have last_name as Ardel. Also, the below curl example will sort the results in descending order by organisation_name.  
Note: you can try various possible combinations of sorting here
- `1` represents, Ascending order
- `-1` represents, Descending order

you can use the same format to sort the results based on employee_id. Also can add pagination query params.

### Request

`GET /api/posts/userList`

    curl --location --request GET 'http://localhost:3000/api/posts/userList' \
    --header 'jwt-token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDA1YmFkYWM3NjkzMjI3MmNiZDgzYjEiLCJpYXQiOjE2MTA5ODg1OTJ9.vDkNYhd9cMSqVZZdB6NMoDGeu1VKrl8XQMYrAo8vit4' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "last_name": "Ardel",
        "sortBy": {"employee_details.organisation_name":-1 }
    }'

### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 534
    ETag: W/"216-Z7ATajYHA0GzoiC+rb0fq1mOPQ0"
    Date: Mon, 18 Jan 2021 16:57:59 GMT
    Connection: keep-alive
    [{"metadata":[{"total":2,"page":1}],"data":[{"_id":"60044c06a2c7390db4858ecd","first_name":"Sara","last_name":"Ardel","email":"sara.ardel@gmail.com","employee_details":[{"_id":"60044c06a2c7390db4858ece","organisation_name":"Larson and turbo","user":"60044c06a2c7390db4858ecd","__v":0}]},{"_id":"6004622934cf5f0428eb6f2e","first_name":"Zehra","last_name":"Ardel","email":"zehra.ardel@gmail.com","employee_details":[{"_id":"6004622934cf5f0428eb6f2f","organisation_name":"Larson and turbo","user":"6004622934cf5f0428eb6f2e","__v":0}]}]}]

## List all users
List all the users in ascending order of employee_id.

### Request

`GET /api/posts/userList`

    curl --location --request GET 'http://localhost:3000/api/posts/userList' \
    --header 'jwt-token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDA1YmFkYWM3NjkzMjI3MmNiZDgzYjEiLCJpYXQiOjE2MTA5ODg1OTJ9.vDkNYhd9cMSqVZZdB6NMoDGeu1VKrl8XQMYrAo8vit4' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "sortBy": {"employee_details.employee_id":1 }
    }'

### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 1749
    ETag: W/"6d5-Sy4ehMS2fymJQ/fGQyIww4aHtf8"
    Date: Mon, 18 Jan 2021 17:18:08 GMT
    Connection: keep-alive
    [{"metadata":[{"total":7,"page":1}],"data":[{"_id":"600442f70a52063ed09d83bc","first_name":"IBu","last_name":"Bibu","email":"ibu.bibu@gmail.com","employee_details":[{"_id":"600442f70a52063ed09d83bd","organisation_name":"Gaming Industry","user":"600442f70a52063ed09d83bc","__v":0}]},{"_id":"60044b80a2c7390db4858ecb","first_name":"Sheldon","last_name":"Cooper","email":"sheldon.cooper@gmail.com","employee_details":[{"_id":"60044b80a2c7390db4858ecc","organisation_name":"Harward","user":"60044b80a2c7390db4858ecb","__v":0}]},{"_id":"60044c06a2c7390db4858ecd","first_name":"Sara","last_name":"Ardel","email":"sara.ardel@gmail.com","employee_details":[{"_id":"60044c06a2c7390db4858ece","organisation_name":"Larson and turbo","user":"60044c06a2c7390db4858ecd","__v":0}]},{"_id":"6004622934cf5f0428eb6f2e","first_name":"Zehra","last_name":"Ardel","email":"zehra.ardel@gmail.com","employee_details":[{"_id":"6004622934cf5f0428eb6f2f","organisation_name":"Larson and turbo","user":"6004622934cf5f0428eb6f2e","__v":0}]},{"_id":"6004691df3d5443c3882b23a","first_name":"Johny","last_name":"English","email":"johny.english@gmail.com","employee_details":[{"_id":"6004691df3d5443c3882b23b","organisation_name":"Zebra index Industry","user":"6004691df3d5443c3882b23a","__v":0}]},{"_id":"6004697ff3d5443c3882b23c","first_name":"Olivia","last_name":"Dunhum","email":"olivia.dunhum@yahoo.com","employee_details":[{"_id":"6004697ff3d5443c3882b23d","organisation_name":"Morningstar","user":"6004697ff3d5443c3882b23c","__v":0}]},{"_id":"6005badac76932272cbd83b1","first_name":"Tommy","last_name":"Blake","email":"tommy.blake@yahoo.com","employee_details":[{"_id":"6005badac76932272cbd83b2","organisation_name":"Accenture","user":"6005badac76932272cbd83b1","__v":0}]}]}]


## Pagination with User List and sort criteria
List all the users in descending order of first_name, also with pagination. The response will have 3 (size) items of the 2nd page.
Note: you can also add a search criteria, for e.g. "first_name": "Sheldon"
### Request

`GET /api/posts/userList`

    curl --location --request GET 'http://localhost:3000/api/posts/userList?pageNo=2&size=3' \
    --header 'jwt-token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDA1YmFkYWM3NjkzMjI3MmNiZDgzYjEiLCJpYXQiOjE2MTA5ODg1OTJ9.vDkNYhd9cMSqVZZdB6NMoDGeu1VKrl8XQMYrAo8vit4' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "sortBy": {"first_name":-1 }
    }'

### Response

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 786
    ETag: W/"312-K/HKTwcSl5tSiIxWqInGiz64CEQ"
    Date: Mon, 18 Jan 2021 17:15:26 GMT
    Connection: keep-alive
    [{"metadata":[{"total":7,"page":2}],"data":[{"_id":"60044c06a2c7390db4858ecd","first_name":"Sara","last_name":"Ardel","email":"sara.ardel@gmail.com","employee_details":[{"_id":"60044c06a2c7390db4858ece","organisation_name":"Larson and turbo","user":"60044c06a2c7390db4858ecd","__v":0}]},{"_id":"6004697ff3d5443c3882b23c","first_name":"Olivia","last_name":"Dunhum","email":"olivia.dunhum@yahoo.com","employee_details":[{"_id":"6004697ff3d5443c3882b23d","organisation_name":"Morningstar","user":"6004697ff3d5443c3882b23c","__v":0}]},{"_id":"6004691df3d5443c3882b23a","first_name":"Johny","last_name":"English","email":"johny.english@gmail.com","employee_details":[{"_id":"6004691df3d5443c3882b23b","organisation_name":"Zebra index Industry","user":"6004691df3d5443c3882b23a","__v":0}]}]}]
