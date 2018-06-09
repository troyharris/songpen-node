const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const config = require("../config");

function generateToken(user) {
	return jwt.sign(user, config.secret, {
		expiresIn: 10800
	});
}

function setUserInfo(request) {
	return {
		_id: request._id,
		firstName: request.profile.firstName,
		lastName: request.profile.lastName,
		email: request.email
	};
}

exports.login = function(req, res, next) {
	let userInfo = setUserInfo(req.user);

	res.status(200).json({
		token: "JWT" + generateToken(userInfo),
		user: userInfo
	});
};

exports.register = function(req, res, next) {
	console.log("About to register");
	// Check for registration errors
	const email = req.body.email;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const password = req.body.password;

	// Return error if no email provided
	if (!email) {
		return res.status(422).send({ error: "You must enter an email address." });
	}

	// Return error if no password provided
	if (!password) {
		return res.status(422).send({ error: "You must enter a password." });
	}

	User.findOne({ email: email }, function(err, existingUser) {
		if (err) {
			return next(err);
		}

		// If user is not unique, return error
		if (existingUser) {
			return res
				.status(422)
				.send({ error: "That email address is already in use." });
		}
		console.log(
			"User doesn't exist and everything is good. About to create user."
		);
		// If email is unique and password was provided, create account
		let user = new User({
			email: email,
			password: password
		});
		console.log(user);
		user.save(function(err, user) {
			console.log("Saving user");
			if (err) {
				return next(err);
				console.log(err);
			}

			// Subscribe member to Mailchimp list
			// mailchimp.subscribeToNewsletter(user.email);

			// Respond with JWT if user was created

			let userInfo = setUserInfo(user);

			res.status(201).json({
				token: "JWT " + generateToken(userInfo),
				user: userInfo
			});
		});
	});
};
