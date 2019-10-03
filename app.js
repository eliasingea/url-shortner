var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 

var index = require('./routes/index');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/resthub', { useNewUrlParser: true});
var db = mongoose.connection;

var port = process.env.PORT || 8080;        // set our port

app.set('view engine', 'pug'); 

app.get('/', (req, res) => {
    res.render('index', { title: 'Hey' })
}); 

app.use('/api', index); 

app.listen(port); 
module.exports = app;