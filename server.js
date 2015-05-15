// Setup
var express = require('express'); 
var app = express(); // Create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log request to the console (express4)
var bodyParser = require('body-parser'); // Pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// Config

mongoose.connect('mongodb://madmandrit:templar@ds031832.mongolab.com:31832/todo') // Connecting to mongolab


app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // Log every request to the console
app.use(bodyParser.urlencoded({'extended' : 'true'})); // Parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json'})); // Parse application/vnd.api+json as json
app.use(methodOverride());

// Model
var Todo = mongoose.model('Todo', {
	text: String
});

// Routes

// Api
// Get all todos

app.get('/api/todos', function(req, res) {
	// Grab all todos in database
	Todo.find(function(err, todos) {
		// If there is an error retrieving, send the error. nothing after res.send(err) will execute
		if(err) {
			res.send(err);
		}
		res.json(todos); // Return all todos in Json format
	});
});


// Create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {
	// Create a todo, info comes from ajax request from angular
	Todo.create({
		text : req.body.text,
		done : false
	}, function(err, todo) {
		if(err) {
			res.send(err);
		}
		// Get and return all the todos after you create another
		Todo.find(function(err, todos) {
			if(err) {
				res.send(err)
			}
			res.json(todos);
		});
	});
});

// Delete
app.delete('/api/todos/:todo_id', function(req, res) {
	Todo.remove({
		_id : req.params.todo_id
	}, function(err, todo) {
		if(err) {
			res.send(err);
		}

		// Get and return all the todos after creating another
		Todo.find(function(err, todos) {
			if(err) {
				res.send(err);
			}
			res.json(todos);
		});
	});
});

// Application
app.get('*', function(req, res) {
	res.sendfile('./public/index.html'); // Load the single view file. Angular will handle the page changes on the front-end.
});

// Listen - Start application with node server.js
app.listen(2323);
console.log("Todo is listening on port 2323");





