require("dotenv").config();
const fs = require("fs");

const envPath = "./static/env-config.js";
try {
	fs.unlinkSync(envPath);
} catch {}
try {
	fs.unlinkSync(versionPath);
} catch {}

const env = {};
for (const key in process.env) {
	if (key.startsWith("APP_")) {
		env[key] = process.env[key];
	}
}

const fileContent = `window.envConfig = JSON.parse(\`${JSON.stringify(env)}\`)`;
fs.appendFile(envPath, fileContent, function (err) {
	if (err) throw err;
	console.log("✔ ENV Builded!");
});

// Get Package Version
