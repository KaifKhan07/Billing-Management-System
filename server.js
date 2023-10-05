const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const path = require("path");
const mongoose = require("mongoose"); // Import mongoose directly
const connectDb = require("./config/connectDb");
// config dot env file
dotenv.config();

// Rest object
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Routes
//user routes
app.use("/api/v1/users", require("./routes/userRoute"));
//transections routes
app.use("/api/v1/transections", require("./routes/transectionRoutes"));

// Static files
app.use(express.static(path.join(__dirname, "./client/build")));

// Initialize the Mongoose connection and start the server
const startServer = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`.bgCyan.white);

    // Start listening for requests after the database connection is established
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`${error}`.bgRed);
    process.exit(1);
  }
};

// Call the function to start the server
startServer();
