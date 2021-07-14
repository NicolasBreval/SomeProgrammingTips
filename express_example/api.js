/**
 * Simple example of an API with JWT authentication.
 * 
 * This API contains two endpoints:
 *  /auth: Used to generate a JWT token from a classic user/password authentication
 *  /data: Used to get some hardcoded data if provided JWT token is valid
 * 
 * This example is a variation of this example: https://asfo.medium.com/autenticando-un-api-rest-con-nodejs-y-jwt-json-web-tokens-5f3674aba50e
 * 
 * IMPORTANT!!!: In example body-parser library is used to parse client requests, but currently this library is deprecated, express
 * library contains already a custom parser for this proposals
 */

const express = require('express'); // Library used to define a web server for our REST API
const jwt = require('jsonwebtoken'); // Library used for JWT control
const config = require('./configs/config') // Custom library for global configurations

const users = { 'user': '1234' } // Predefined user for login, it's possible to add more users as new keys and values in this object

const protectedRoutes = express.Router(); // Express Router object, with this object is possible to define custom login logic

protectedRoutes
.use((req, res, next) => {
    console.log(`Request received: ${req.url}`);
    next();
}).use((req, res, next) => {
    const token = req.headers['access-token'];

    if (token) {
        jwt.verify(token, app.get('key'), (err, decoded) => {
            if (err) {
                return res.json({ message: 'Invalid token' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            message: 'Token not provided'
        });
    }
});

// Initializes server object
app = express()

// Set secret ket configuration
app.set('key', config.key);

// Add parsers for receive and send data in different formats
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Defines an authentication endpoint to login
app.post('/auth', (req, res) => {
    if (req.body.password === users[req.body.user]) {
        const payload = {
            check: true
        };

        const token = jwt.sign(payload, app.get('key'), {
            expiresIn: 1440
        });

        res.json({
            message: 'Correct authentication',
            token: token
        });
    } else {
        res.json({
            message: 'Invalid authentication'
        });
    }
});

// Defines an endpoint to retrieve data only if JWT authentication token is valid
// When we add protectedRoutes as parameter, executes protectedRoutes function before endpoint function
app.get('/data', protectedRoutes, (req, res) => {
    const data = [
        { id: 1, name: "Asfo" },
        { id: 2, name: "Denisse" },
        { id: 3, name: "Carlos" }
    ];

    res.json(data);
});

// Initialize server at port 3000
app.listen(3000, () => {
    console.log('Server initialized')
});