const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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

module.exports = mongoose.model("User", userSchema);
