// encode.js
const fs = require("fs");
const path = require("path");

const json = fs.readFileSync(path.join(__dirname, "./firebase-service-account.json"), "utf-8");
const encoded = Buffer.from(json).toString("base64");
console.log(encoded);
