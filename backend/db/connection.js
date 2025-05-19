const mongoose = require("mongoose");

const connectionString = process.env.connection_string;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("MongoDB  Connected Successfully");
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed", err);
  }); 
