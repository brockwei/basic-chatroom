/*Modules installed
express
express session
redis
socket.io
//sequelize
passport
passport-facebook
dotenv

redis-session
cookie-parser
cookie-session
*/

const express = require('express');
const app = express();
const session = require('express-session');
const setupPassport = require('./passport');
const bodyParser = require('body-parser');
const router = require('./router')(express);
const port = process.env.PORT || 8080;

app.use(express.static('public'));

//Websockets
const http = require('http').Server(app);
const io = require('socket.io')(http);
//Cookie-parser
var cookieParser = require('cookie-parser');
app.use(cookieParser());
//Cookie-session
/*var cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    secret: 'a hard to guess secret',
    maxAge: 24*60*60*1000
}))*/
//Redis
const client = require('./redis');


const sessionMiddleware = session({
    secret: 'supersecret'
});
io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
});
app.use(sessionMiddleware);
/*app.use(session({
    secret: 'supersecret'
}));*/

app.use(bodyParser());

setupPassport(app);
app.use('/', router);
//const router = require('./router')(express);
require('./websocket')(io);

/*Need http to listen to port for websockets*/
http.listen(port);