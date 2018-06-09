const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;

const UserSchema = Schema(
	{
		email: {
			type: String,
			required: true,
			lowercase: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		profile: {
			firstName: { type: String },
			lastName: { type: String }
		},
		resetPasswordToken: { type: String },
		resetPasswordExpires: { type: Date }
	},
	{
		timestamps: true
	}
);

UserSchema.pre("save", function(next) {
	console.log("Save prehook.");
	if (!this.isModified("password")) return next();

	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			return next(err);
		}
		bcrypt.hash(this.password, salt, null, (err, hash) => {
			if (err) {
				return next(err);
			}
			this.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

module.exports = mongoose.model("User", UserSchema);
