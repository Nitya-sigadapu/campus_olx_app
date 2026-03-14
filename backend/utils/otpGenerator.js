const bcrypt = require("bcrypt");
const db = require("../config/db");

function generateOTP() {
 return Math.floor(100000 + Math.random() * 900000).toString();
}