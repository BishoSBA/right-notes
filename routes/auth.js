const express = require("express");
const passport = require("passport");
const router = express.Router();
const validator = require("validator");

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
router.get("/login", (req, res) => {
	if (req.user) {
		return res.redirect("/dashboard");
	}
	res.render("/", {
		title: "Login",
	});
});

//@desc logging in
//@route POST /auth/login
router.post("/login", (req, res, next) => {
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

	passport.authenticate("local", (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			req.flash("errors", info);
			return res.redirect("/");
		}
		req.logIn(user, (err) => {
			if (err) {
				return next(err);
			}
			req.flash("success", { msg: "Success! You are logged in." });
			res.redirect(req.session.returnTo || "/dashboard");
		});
	})(req, res, next);
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
