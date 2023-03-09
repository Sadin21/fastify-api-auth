const { default: mongoose } = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/bus_auth")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));
