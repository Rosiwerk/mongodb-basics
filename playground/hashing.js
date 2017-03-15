// JWTs = JSON Web Tokens support (???????)

const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var password = "123abc!";

bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(password, salt, (err, hash) => {
		// Here you save hash to the database
	});
});

var hashedPassword = "$2a$10$RlF4TT5YiFsIAD73gIXmj.Fom5FcPMGE774iLhGldMpTpur8n66Ty";

// Compare using callback
bcrypt.compare(password, hashedPassword, (err, res) => {
	if (res === true) {
		console.log("The are the same!")
	} else if (res === false) {
		console.log("They are not the same :(");
	}
});

// Compare using return promise
bcrypt.compare(password, hashedPassword).then((res) => {
	if (res === true) {
		console.log("The are the same!")
	} else if (res === false) {
		console.log("They are not the same :(");
	}
});

// var data = {
// 	id: 10
// };

// var token = jwt.sign(data, "abc123");
// console.log(token);

// var decoded = jwt.verify(token, "abc123");
// console.log("decoded", decoded);

// var message = "I am user number 4";
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
// 	id: 4
// };

// var token = {
// 	data: data,
// 	hash: SHA256(JSON.stringify(data) + "somesecret").toString()
// };


// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();


// var resultHash = SHA256(JSON.stringify(token.data) + "somesecret").toString();
// if (resultHash === token.hash) {
// 	console.log("Data was not changed.");
// } else {
// 	console.log("Data was changed, don't trust.");
// }