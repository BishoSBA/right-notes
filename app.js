const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const flash = require("express-flash");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const index = require("./routes/index");
const auth = require("./routes/auth");
const notes = require("./routes/notes");
const favicon = require("serve-favicon");

// Load config
dotenv.config({ path: "./config/config.env" });

//Passport config
require("./config/passport")(passport);

connectDB();

const app = express();

// Add favicon
app.use(favicon(path.join(__dirname, "/public/assets/icon.ico")));

// Middleware to allow body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Method override
app.use(
	methodOverride(function (req, res) {
		if (req.body && typeof req.body === "object" && "_method" in req.body) {
			// look in urlencoded POST bodies and delete it
			let method = req.body._method;
			delete req.body._method;
			return method;
		}
	})
);

if (process.env.NODE_ENV == "development") {
	app.use(morgan("dev"));
}

// Handlebars helpers
const { formatDate, stripTags, truncate, editIcon, select } = require("./helpers/hbs");

// Handlebars for template engine
app.engine(
	".hbs",
	exphbs.engine({
		helpers: { formatDate, stripTags, truncate, editIcon, select },
		defaultLayout: "main",
		extname: ".hbs",
	})
);
app.set("view engine", ".hbs");

// Sessions
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	next();
});

// Use flash for error handling
app.use(flash());

//static folders
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", index);
app.use("/auth", auth);
app.use("/notes", notes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
