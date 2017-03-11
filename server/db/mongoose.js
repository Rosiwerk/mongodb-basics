var mongoose = require("mongoose");

// Promises aren't build in (callbacks are), but he likes to use them so...
mongoose.Promise = global.Promise;
db = {
  localhost: "mongodb://localhost:27017/TodoApp",
  mlab: "mongodb://rosiwerk:mamamijajo@ds129030.mlab.com:29030/mydatabase1"
}
mongoose.connect(db.mlab || db.localhost);

module.exports = {
	mongoose
};