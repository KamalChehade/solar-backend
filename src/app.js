const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const configureCors = require("./config/corsConfig");
const helmet = require("helmet");
const { errorHandler, routeNotFound } = require("./middlewares/errorHandler.js");
const authenticateToken = require("./middlewares/authMiddleware");


dotenv.config();
const app = express();


app.use(configureCors());
app.use(express.json());

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use("/solar-api/uploads", express.static(path.join(__dirname, "uploads")));
app.use(authenticateToken);

app.use("/nino-api", require("./routes"));

app.use(routeNotFound);
app.use(errorHandler);

module.exports = app;
