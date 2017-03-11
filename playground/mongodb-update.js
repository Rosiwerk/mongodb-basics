// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
	if (err) {
		return console.log("Unable to connect to MongoDB server.");
	}
	console.log("Connected to MongoDB server.");

	// db.collection("Todos").findOneAndUpdate({
	// 	_id: new ObjectID("58b9b7da565be7a15b685cb6")
	// }, {
	// 	$set: {
	// 		completed: false
	// 	}
	// }, {
	// 	returnOriginal: false
	// }).then((result) => {
	// 	console.log(result);
	// });

	db.collection("Users").findOneAndUpdate({
		_id: new ObjectID("58b4504b6efc020780005176")
	}, {
		$max: {
			value: 100
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});

	// db.close();
});