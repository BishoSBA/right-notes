const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	googleId: {
		type: String,
	},
	displayName: {
		type: String,
		required: true,
	},
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		default:
			"https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Password hash middleware.

UserSchema.pre("save", function save(next) {
	const user = this;
	if (!user.isModified("password")) {
		return next();
	}
	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			return next(err);
		}
		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) {
				return next(err);
			}
			user.password = hash;
			next();
		});
	});
});

// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		cb(err, isMatch);
	});
};

module.exports = mongoose.model("User", UserSchema);
