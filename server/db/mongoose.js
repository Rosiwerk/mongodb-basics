var mongoose = require("mongoose");

// Promises aren't build in (callbacks are), but he likes to use them so...
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://Rosiwerk:mamamijajo@ds129030.mlab.com:29030/mydatabase1" || "mongodb://localhost:27017/TodoApp");

module.exports = {
	mongoose
};

// "mongodb://localhost:27017/TodoApp"
// "mongodb://rosiwerk:mamamijajo@ds129030.mlab.com:29030/mydatabase1"