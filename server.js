const app = require("./app");
const mongoose = require("mongoose");

const DB_HOST =
  "mongodb+srv://andreswebit:bHVHcJ0qBWlWntNH@cluster0.4xcxxjl.mongodb.net/contacts-db?retryWrites=true&w=majority";

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(`Server not running. Error message: ${error.message}`);
    process.exit(1);
  });

// const app = require('./app')

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000")
// })
