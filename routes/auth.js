const express = require("express");
const router = express.Router();
const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const { ensureGuest, ensureAuth } = require("../middleware/auth");

//@desc Auth with Google
//@route GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

//@desc Google autho callback
//@route GET /auth/google/callback
router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/" }),
	(req, res) => {
		res.redirect("/dashboard");
	}
);

//@desc Redirect from login
//@route GET /auth/login
router.get("/login", ensureGuest, (req, res) => {
	res.redirect("/dashboard");
});

//@desc logging in
//@route POST /auth/login
router.post("/login", passport.authenticate("local", { failureRedirect: "/" }), (req, res) => {
	const validationErrors = [];
	if (!validator.isEmail(req.body.email))
		validationErrors.push({ msg: "Please enter a valid email address." });
	if (validator.isEmpty(req.body.password))
		validationErrors.push({ msg: "Password cannot be blank." });

	if (validationErrors.length) {
		req.flash("errors", validationErrors);
		return res.redirect("../");
	}
	req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

	console.log(req.body);
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			console.error(err);
			return res.redirect("/login");
		}
		if (!user) {
			req.flash("errors", info);
			return res.redirect("/login");
		}
		req.logIn(user, (err) => {
			if (err) {
				console.error(err);
				return res.redirect("/login");
			}
			req.flash("success", { msg: "Success! You are logged in." });
			res.redirect(req.session.returnTo || "/dashboard");
		});
	})(req, res);
});

//@desc Redirect from signup
//@route GET /auth/signup
router.get("/signup", (req, res) => {
	if (req.user) {
		return res.redirect("/dashboard");
	}
	res.redirect("/signup");
});

//@desc Processing sign up form
//@route POST /auth/signup
router.post("/signup", (req, res) => {
	const validationErrors = [];
	if (!validator.isEmail(req.body.email))
		validationErrors.push({ msg: "Please enter a valid email address." });
	if (!validator.isLength(req.body.password, { min: 8 }))
		validationErrors.push({ msg: "Password must be at least 8 characters long" });
	if (req.body.password !== req.body.confirmPassword)
		validationErrors.push({ msg: "Passwords do not match" });

	if (validationErrors.length) {
		req.flash("errors", validationErrors);
		return res.redirect("../signup");
	}
	req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

	const user = new User({
		firstName: req.body.firstname,
		lastName: req.body.lastname,
		displayName: req.body.firstname + " " + req.body.lastname,
		email: req.body.email,
		password: req.body.password,
	});

	User.findOne({ email: req.body.email }, (err, existingUser) => {
		console.log(req.body);
		if (err) {
			console.log(err);
			return res.redirect("../signup");
		}
		if (existingUser) {
			console.log(existingUser);
			req.flash("errors", {
				msg: "Account with that email address or username already exists.",
			});
			return res.redirect("../signup");
		}
		user.save((err) => {
			if (err) {
				console.log(err);
				return res.redirect("../signup");
			}
			req.logIn(user, (err) => {
				if (err) {
					console.log(err);
					return res.redirect("../signup");
				}
				console.log("end");
				res.redirect("/dashboard");
			});
		});
	});
});

//@desc Logout user
//@route /auth/logout
router.get("/logout", (req, res) => {
	req.logout((err) => {
		if (err) console.error(err);
	});
	res.redirect("/");
});

module.exports = router;
