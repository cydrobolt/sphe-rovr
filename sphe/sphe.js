#!/usr/bin/env node

/*
    Sphe-rovr
    VR Rover Server
    http://github.com/Cydrobolt/sphe-rovr
*/

var express = require('express');
var logger = require('morgan');
var session = require('cookie-session');
var uuid = require('node-uuid');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var config = require('./config.json');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(parseInt(config.port), config.host);

var randomID = uuid.v4();
app.use(session({
    secret: randomID
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


console.log("Starting server...");

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


io.on('connection', function (socket) {
  socket.on('play_horn', function (data) {
    console.log(data);
    socket.broadcast.emit('receive_horn');
  });
});

app.get('/', function(req,res) {
    var token = req.session.token;
    if (!token || token === false) {
        res.render('indexNL');
    }
    else {
        res.render('indexL', {token: token});
    }
});

app.post('/process_token', function(req, res) {
    var token = req.body.token;
    req.session.token = token;
    res.redirect('/');
});

app.get('/logout', function(req,res) {
    delete req.session.token;
    res.redirect('/');
});
