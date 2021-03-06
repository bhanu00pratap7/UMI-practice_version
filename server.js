const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./dbconfig.json");
const database = require("./database");
const operations = require("./operations");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({ secret: "I have a car" }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", express.static("public"));
app.use("/public", express.static(path.join(__dirname, "./public")));
app.use("/assets", express.static(path.join(__dirname, "./assets")));

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/"
  })
);

passport.use(
  new passportLocal(function(email, password, done) {
    database.getUser(email, function(data) {
      console.log(data[0].password);
      console.log(data);

      if (email !== data[0].email) {
        return done(null, false, { message: "email is incorrect" });
      }

      operations.compare(password, data[0].password, function(show) {
        if (!show) {
          return done(null, false, { message: "password is incorrect" });
        }

        return done(null, data[0].email);
      });
    });
  })
);

passport.serializeUser(function(id, done) {
  return done(null, id);
});

passport.deserializeUser(function(id, done) {
  return done(null, id);
});

app.get("/success", function(req, res) {
  console.log("success");
  console.log(req.user.email);
  res.send(req.user.email);
});

app.get("/data", function(req, res) {
  if (req.user) {
    res.send("Validated");
  } else {
    res.redirect("/");
  }
});

app.post("/signup", function(req, res) {
  operations.encrypt(
    req.body.first_name,
    req.body.last_name,
    req.body.email,
    req.body.password,
    req.body.birthday,
    req.body.ph_number,
    function(data) {
      res.send(data);
    }
  );
});

app.listen(5000, function(req, res) {
  console.log("server is listening at port no. 5000");
  database.connectDB();
  console.log("database connected");
});
