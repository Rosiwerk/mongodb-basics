const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");


User.findById("58badac029f2ac2254340090").then((user) => {
	if (!user) {
		return console.log("User not found.")
	}
	console.log(JSON.stringify(user, undefined, 2));
}, (err) => {
	console.log("ID not valid, feelsbadman.");
});

// var id = "58becd3ed1a5d327cc2e903711";

// if (!ObjectID.isValid(id)) {
// 	console.log("ID not valid, feelsbadman.")
// };

// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log("Todos", todos);
// });

// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	if (!todo) {
// 		return console.log("Id not found.");
// 	}
// 	console.log("Todo", todo);
// });

// Todo.findById(id).then((todo) => {
// 	if (!todo) {
// 		return console.log("Id not found.");
// 	}
// 	console.log("Todo By Id", todo);
// }).catch((e) => {

// });
