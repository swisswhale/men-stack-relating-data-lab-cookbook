const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const methodOverride = require("method-override");
const session = require("express-session");
const path = require("path");

const authController = require("./controllers/auth");
const recipesController = require("./controllers/recipes");
const ingredientsController = require("./controllers/ingredients");

const isSignedIn = require("./middleware/is-signed-in");
const passUserToView = require("./middleware/pass-user-to-view");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session({ secret: "cookbook-secret", resave: false, saveUninitialized: false }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(passUserToView);

app.get("/", (req, res) => {
  res.render("index", { user: req.session.user || null });
});
app.use("/auth", authController);
app.use(isSignedIn);
app.use("/recipes", recipesController);
app.use("/ingredients", ingredientsController);

app.listen(3000, () => console.log("Server running on port 3000"));