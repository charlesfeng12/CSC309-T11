Your Tasks
The starter code already contains most of the implementations Your main objective is to connect the frontend with the backend such that they can communicate with each other in a production environment.

Task 1
Currently, the frontend code is unable to interact with the backend API endpoints because they are hosted under different origins (i.e., different domains, protocols, or port numbers). Even during development, the backend server typically runs on http://localhost:3000Links to an external site., while the React development server runs on http://localhost:5173Links to an external site.. 

 

This difference triggers the Same-Origin Policy (SOP), a security mechanism enforced by web browsers to prevent unauthorized requests between different origins. As a result, the browser blocks the frontend from making requests to the backend by default.

 

To enable communication, the backend must explicitly allow cross-origin requests using Cross-Origin Resource Sharing (CORS). CORS works by adding special HTTP headers to responses, specifying which origins are permitted to access the backend.

 

Make the appropriate changes to backend/index.js to use the cors middleware, so that you can configure the server to only accept requests only from your frontend.

Please refer to https://expressjs.com/en/resources/middleware/cors.htmlLinks to an external site. for more information on using the cors middleware.

It is important to use an environment variable to specify the frontend URL, otherwise you will not be able to change it during production without changing the code. Your server should load environment variables from the .env file, and use a default value when the file is missing, e.g.:

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

Task 2
At the moment, the frontend is missing code for making API calls to the backend. You need to complete the AuthProvider function in frontend/src/contexts/authContext.jsx. 

Before that, you need to specify the backend URL. For Vite, all environment variables must be prefixed with "VITE_", and they can be accessed under import.meta.env, e.g.:

const VITE_BACKEND_URL = "http://localhost:3000";

During development, you can create a .env file in frontend with: VITE_BACKEND_URL="http://localhost:3000", or just use a default port;

There are three backend API endpoints that you will need to access to complete task 2, as listed below. When an error occurs, all API endpoints will return a 400 level status code, with the following response format:

```
{
   "message" : "the error message"
}
```

/login
Method: POST
Description: Authenticate a user and generate a JWT token
Content-Type: application/json
Payload:
|Field|Required|Type|Description|
| :--- | :---: | :---: | ---: |
|username|Yes|string|The username of a registered user|
|password|Yes|string|The password of the user|

Responses
200 OK on sucess
```
{
  "token": "jwt_token_here"
}
```

/register
Method: POST
Description: Register a new user
Content-Type: application/json
Payload:
|Field|Required|Type|Description|
| :--- | :---: | :---: | ---: |
|username|Yes|string|Must be unique|
|firstname|Yes|string|The first name of the user|
|lastname|Yes|string|The last name of the user|
|password|Yes|string|The password that can later be used to authenticate the user|

Response:
201 Created on success
```
{
  "message": "User registered successfully"
}
```
409 Conflict if a user with that username already exists


/user/me
Method: GET
Description: Retrieve the information of the authenticated user
Payload: None
Response:
200 OK on success
```
{
  "user" : {
    "id": 1,
    "username": "johndoe",
    "firstname": "John",
    "lastname": "Doe",
    "createdAt": <time the server starts>
  }
}
```
Implementation
You need to implement the three functions defined in AuthProvider and manage the user context state as follows:

useEffect
When the user is logged in (i.e., localStorage contains a valid token), fetch the user data from /user/me and update the user context state with the returned user object.
When the user is not logged in (i.e., localStorage does not contain a token), set the user context state to null.
Additionally, ensure that the authentication state persists across hard reloads (e.g., when the user refreshes the page). Hint: useEffect can be useful for checking the stored token and fetching user data when the component mounts.

function login(username, password)
Implement the login function using the Fetch API to send a request to /login. If login fails, return the error message from the response. If it succeeds, you need to do three things:

Store the received token in localStorage. Please use 'token' as the key, otherwise the autotester will have trouble restoring session state across hard reloads.
Update the user context state.
Lastly, redirect the user to /profile. 
function register({username, firstname, lastname, password})
The register function takes an object with four fields, and can be implemented with the /register endpoint Upon success, navigate to /success. Otherwise, return the received error message. 

function logout()
This function does not require making any API calls. Simply remove the token from localStorage, set the user context state to null, then navigate to /.