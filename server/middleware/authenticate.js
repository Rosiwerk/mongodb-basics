var {User} = require("./../models/user");

var authenticate = (req, res, next) => {
	var token = req.header("x-auth");

	User.findByToken(token).then((user) => {
		if (!user) {
			// Does the same thing as the code below
			// (the .catch)
			return Promise.reject();
		}

		// modify request object
		req.user = user;
		req.token = token;
		next();
	}).catch((e) => {
		res.status(401).send();
	});
};

module.exports = {authenticate: authenticate};