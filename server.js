// server.js

// set up ======================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// configuration ===============================================

mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

// define model ================================================

var Todo = mongoose.model('Todo', {
  text : String
});

// listen (start app with node server.js) ======================
app.listen(8080);
console.log("App listening on port 8080");

// routes =======================================================

//++ api --------------------------------------------------------
//++ get all todos
app.get('/api/todos', function(request, response) {

  // use mongoose to get all todos in the database
  Todo.find(function (error, todos) {

    // if there is an error retrieving, send the error.
    //nothing after response.send(error) will execute.

    if (error)
      response.send(error)

    response.json(todos); // return all todos in JSON format
  });
})
