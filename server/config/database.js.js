const mongoose = require("mongoose");

const dbConnection = () => {
    mongoose
        .connect(process.env.CONNECTION_URL)
        .then(() => {
            console.log("Connected to MongoDB database successfully!");
        })
        .catch((err) => {
            console.error(`Database Error: ${err}`);
        });
};
module.exports = dbConnection;