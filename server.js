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
var port = process.env.PORT || 8080;
app.listen(port);

// app.listen(8080);
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

// create todo and send back all todos after creation
app.post('/api/todos', function(request, response) {

  // create a todo, information comes from AJAX request from Angular
  Todo.create({
    text : request.body.text,
    done : false
  }, function(error, todo) {
    if (error)
      response.send(error);

    // get and return all the todos after you create another
    Todo.find(function(error, todos) {
      if (error)
        response.send(error)

      response.json(todos);
    });
  });
});

// delete a todo
app.delete('/api/todos/:todo_id', function(request, response) {
  Todo.remove({
    _id : request.params.todo_id
  }, function(error, todo) {
    if (error)
      response.send(error);

    // get and return all the todos after you delete
    Todo.find(function(error, todos) {
      if (error)
        response.send(error)
      response.json(todos);
    });
  });
});


// application ----------------------------------------------------
app.get('*', function(request, response) {
  // load the single view file
  // (angular will hindale the page changes on the front-end)
  response.sendfile('./public/index.html');
});
