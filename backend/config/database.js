const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = async() => {
    mongoose.connect(process.env.URL_DATABASE)
    .then(() => {console.log("DB connected successfully")})
    .catch( (err) => {
        console.log("DB CONNECTION ISSUES");
        console.error(err);
        process.exit(1);
    } );
}