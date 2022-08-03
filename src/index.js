import css from "./style.scss";

import storageAvailable from "./storageAvailable.js";

//Checks if local storage is available
let db,
	dbConnectionStr = DB_STRING,
	dbName = "rap";

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
	(client) => {
		console.log(`Connected to ${dbName} Database`);
		db = client.db(dbName);
	}
);
