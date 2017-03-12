const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose-local");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

// Todo.remove({}) => removes all (the object is needed)

// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

// Todo.findOneAndRemove
/* This gets the object, so you can print it 
to the screen or do smtn with it */



// Todo.findByIdAndRemove
/* Pretty obvious, also returns the doc */

Todo.findOneAndRemove({_id: "58c50f16ab3f35b87b53c653"}).then(() => {
	/*...*/
});

Todo.findByIdAndRemove("58c50f16ab3f35b87b53c653").then((todo) => {
	console.log(todo)
});