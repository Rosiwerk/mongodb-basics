// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
	if (err) {
		return console.log("Unable to connect to MongoDB server.");
	}
	console.log("Connected to MongoDB server.");

	// db.collection("Users").deleteMany({name: "Philip"}).then((result) => {
	// 	console.log(result);
	// }, (err) => {
	// 	console.log("...");
	// });

	db.collection("Users").findOneAndDelete({_id: 123}).then((result) => {
		console.log(result);
	}, (err) => {
		console.log("..");
	});

	// db.close();
});