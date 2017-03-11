// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
	if (err) {
		return console.log("Unable to connect to MongoDB server.");
	}
	console.log("Connected to MongoDB server.");

	// db.collection("Todos").find({
	// 	_id: new ObjectID("58b44f7110f4590d58270dfa")
	// }).toArray().then((docs) => {
	// 	console.log("Todos");
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log("Unable to fetch todos", err)
	// });

	// db.collection("Todos").find().count().then((count) => {
	// 	console.log(`Todos count: ${count}`);
	// }, (err) => {
	// 	console.log("Unable to fetch todos", err);
	// });

	db.collection("Users").find({
		name: "Philip"
	}).toArray().then((docs) => {
		console.log("Users");
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log(`Something went wrong`, err);
	});

	// db.close();
});