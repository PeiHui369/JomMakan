const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoute = require("./routes/auth.route");
const reserveRoute = require("./routes/reservation.route");
const restaurantRoute = require("./routes/restaurant.route");
const workshopRoute = require("./routes/workshop.route");
const registerRoute = require("./routes/register.route");
const reviewRoute = require("./routes/review.route");
const profileRoute = require("./routes/profile.route");
// const cloudinary = require("cloudinary").v2;
// const Multer = require("multer");

// connect to express app
const app = express();

const dbURI = process.env.MONGO_URI;
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());

// Use the CORS middleware
app.use(
  cors({
    origin: ["http://localhost:5173"], // Allow requests from this origin
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true, // Allow cookies and other credentials
  })
);

mongoose
  .connect(dbURI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server connected to port ${port} and MongoDB`);
    });
  })
  .catch((error) => {
    console.log("Unable to connect to Server and/or MongoDB", error);
  });

// middleware // Parses the text as json
app.use(bodyParser.json());
app.use(cors());

//Routes
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/reservation", reserveRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/review", reviewRoute);
app.use("/api/workshop", workshopRoute);
app.use("/api/registration", registerRoute);
