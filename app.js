require("dotenv").config();
// 骨架
const express = require("express");
// ejs用来做template，一个filed做很多页面
const ejs = require("ejs");
// database non relazioneale
const mongoose = require("mongoose");

const passport = require("passport");
const _ = require("lodash");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const { initialize } = require("passport");
const findOrCreate = require("mongoose-findorcreate");
const logout = require("express-passport-logout");
const passportHttp = require("passport-http");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("pubblic"));

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// connettere la database
mongoose.connect("mongodb://localhost:27017/monumentiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// usato per togliere warning quando usa passport
mongoose.set("useCreateIndex", true);

// const descriptionSchema = new mongoose.Schema({ description: String });

// const description = mongoose.model("description", descriptionSchema);

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String
});

const monumentiSchema = new mongoose.Schema({
  name: String,
  title: String,
  image: String,
  decription: Array,
  indirizzo: String,
  Orari: String,
  costo: String,
  durata: String,
  Link_1: String,
  Link_2: String,
  frame: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// create collections in database
const Monumenti = mongoose.model("Monumenti", monumentiSchema);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.get("/", function (req, res) {
  const _LoggedIn = req.isAuthenticated() ? true : false;
  if (_LoggedIn) {
    res.render("logged", {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username
    });
  } else {
    res.sendFile(__dirname + "/index2.html");
  }
});

app.get("/itinerari", function (req, res) {
  const _LoggedIn = req.isAuthenticated() ? true : false;
  if (_LoggedIn) {
    res.render("logged_itinerari", {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username
    });
  } else {
    res.sendFile(__dirname + "/page_ini_itinerari.html");
  }
});

app.get("/itinerari/24ore", function (req, res) {
  const _LoggedIn = req.isAuthenticated() ? true : false;
  if (_LoggedIn) {
    res.render("logged_iti_24ore", {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username
    });
  } else {
    res.redirect("/itinerari");
  }
});

app.get("/itinerari/48ore", function (req, res) {
  const _LoggedIn = req.isAuthenticated() ? true : false;
  if (_LoggedIn) {
    res.render("logged_iti_48ore", {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username
    });
  } else {
    res.redirect("/itinerari");
  }
});

app.get("/itinerari/72ore", function (req, res) {
  const _LoggedIn = req.isAuthenticated() ? true : false;
  if (_LoggedIn) {
    res.render("logged_iti_72ore", {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username
    });
  } else {
    res.redirect("/itinerari");
  }
});

app.get("/aboutus", function (req, res) {
  const _LoggedIn = req.isAuthenticated() ? true : false;
  if (_LoggedIn) {
    res.render("logged_about", {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username
    });
  } else {
    res.sendFile(__dirname + "/about_Us.html");
  }
});

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/sign-up.html");
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/log-in.html");
});

app.get("/success", function (req, res) {
  res.sendFile(__dirname + "/success.html");
});

app.get("/logout", function (req, res) {
  console.log("logged out");
  req.logout();
  res.redirect("/");
});

app.get("/:monuName", function (req, res) {
  const monuName = _.capitalize(req.params.monuName);
  // localhost:3000/colosseo ,req.params.customlistname=colosseo
  const _LoggedIn = req.isAuthenticated() ? true : false;
  if (_LoggedIn) {
    Monumenti.findOne({ name: monuName }, function (err, foundMonu) {
      if (!err) {
        if (foundMonu) {
          res.render("monumenti_logged", {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            username: req.user.username,
            title: foundMonu.title,
            image: foundMonu.image,
            descriptions: foundMonu.decription,
            indirizzo: foundMonu.indirizzo,
            orari: foundMonu.Orari,
            costo: foundMonu.costo,
            durata: foundMonu.durata,
            Link_1: foundMonu.Link_1,
            Link_2: foundMonu.Link_2,
            frame: foundMonu.frame
          });
        }
      }
    });
  } else {
    Monumenti.findOne({ name: monuName }, function (err, foundMonu) {
      if (!err) {
        // se senza error
        if (foundMonu) {
          // se monumenti sono stati trovati
          res.render("monumenti", {
            title: foundMonu.title,
            image: foundMonu.image,
            descriptions: foundMonu.decription,
            indirizzo: foundMonu.indirizzo,
            orari: foundMonu.Orari,
            costo: foundMonu.costo,
            durata: foundMonu.durata,
            Link_1: foundMonu.Link_1,
            Link_2: foundMonu.Link_2,
            frame: foundMonu.frame
          });
        }
      }
    });
  }
});

app.post("/signup", function (req, res) {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username
  });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.render("fail", { problem: err });
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/success");
      });
    }
  });
});

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.render("fail", { problem: err });
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  });
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});
