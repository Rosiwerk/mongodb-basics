const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true, // no other same email in the collection
		validate: {
			validator: validator.isEmail,
			message: "{VALUE} is not valid email, feelsbadman."
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

// Overwriting method so res.send doesn't send back
// the whole object (with password, token, ...)
UserSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ["_id", "email"]);
};

// Creating method for generating auth token
// and adding it to the user object
UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = "auth";
	var token = jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString();

	user.tokens.push({
		 access,
		 token
	});

	return user.save().then(() => {
		return token;
	});
};

UserSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, "abc123");
	} catch (e) {
		// return new Promise((resolve, reject) => {
		// 	reject();
		// });
		return Promise.reject();
	}

	return User.findOne({
		"_id": decoded._id,
		"tokens.token": token,
		"tokens.access": "auth"
	})
};

UserSchema.pre("save", function (next) {
	var user = this;

	// If is modified => true, if not => false
	if (user.isModified("password")) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

var User = mongoose.model("User", UserSchema);

module.exports = {
	User
};