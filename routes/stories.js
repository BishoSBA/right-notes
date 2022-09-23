const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Story = require("../models/Story");

// @desc    Show add stories page
// @route   GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
	res.render("stories/add");
});

// @desc    Process adding stories
// @route   POST /stories/add
router.post("/", ensureAuth, async (req, res) => {
	try {
		req.body.user = req.user.id;
		await Story.create(req.body);
		res.render("dashboard");
	} catch (err) {
		console.error(err);
		res.render("error/500");
	}
});

module.exports = router;
