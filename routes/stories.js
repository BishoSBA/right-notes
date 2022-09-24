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

// @desc    Show all stories page
// @route   GET /stories
router.get("/", ensureAuth, async (req, res) => {
	try {
		const stories = await Story.find({ status: "public" })
			.populate("user")
			.sort({ createdAt: "desc" })
			.lean();
		res.render("stories/index", { stories });
	} catch (err) {
		console.error(err);
		res.render("error/500");
	}
});

// @desc    Show full story page
// @route   GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
	try {
		let story = await Story.findOne({ _id: req.params.id }).populate("user").lean();

		if (!story) {
			return res.render("error/404");
		}

		res.render("stories/show", { story });
	} catch (err) {
		console.error(err);
		res.render("error/404");
	}
});

// @desc    Show edit stories page
// @route   GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
	try {
		const story = await Story.findOne({ _id: req.params.id }).lean();
		console.log(story);
		if (!story) {
			console.error(err);
			res.render("error/404");
		}

		if (story.user != req.user.id) {
			console.error(err);
			res.render("stories");
		} else {
			res.render("stories/edit", {
				story,
			});
		}
	} catch (err) {
		console.error(err);
		return res.redirect("error/500");
	}
});

// @desc    Updates stories after submission
// @route   PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
	try {
		let story = await Story.findById(req.params.id).lean();
		if (story.user != req.user.id) {
			console.error(err);
			res.render("stories");
		} else {
			story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
				new: true,
				runValidators: true,
			});
		}
	} catch (err) {
		console.error(err);
		return res.redirect("error/500");
	}

	res.redirect("/dashboard");
});

// @desc    Delete stories
// @route   DELETE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
	try {
		await Story.remove({ _id: req.params.id });
		res.redirect("/dashboard");
	} catch (err) {
		console.error(err);
		return res.redirect("error/500");
	}
});

// @desc    Show all stories page
// @route   GET /stories/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
	try {
		const stories = await Story.find({ user: req.params.userId, status: "public" })
			.populate("user")
			.lean();
		res.render("stories/index", { stories });
	} catch (err) {
		console.error(err);
		res.render("error/500");
	}
});

module.exports = router;
