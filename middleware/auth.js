module.exports = {
	ensureAuth: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect("/");
		}
	},
	ensureGuest: function (req, res, next) {
		if (!req.isAuthenticated()) {
			return next();
		} else {
			console.log("ZZZ" + req);
			res.redirect("/dashboard");
		}
	},
};
