var mongoose = require("mongoose");

// Promises aren't build in (callbacks are), but he likes to use them so...
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

module.exports = {
	mongoose
};