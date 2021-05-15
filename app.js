const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const passport = require("passport");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("pubblic"));

mongoose.connect("mongodb://localhost:27017/monumentiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// const descriptionSchema = new mongoose.Schema({ description: String });

// const description = mongoose.model("description", descriptionSchema);

const monumentiSchema = new mongoose.Schema({
  name: String,
  title:String,
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

const Monumenti = mongoose.model("Monumenti", monumentiSchema);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index2.html");
});

app.get("/itinerari", function (req, res) {
  res.sendFile(__dirname + "/page_ini_itinerari.html");
});

app.get("/aboutus", function (req, res) {
  res.sendFile(__dirname + "/about_Us.html");
});

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/sign-up.html");
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/log-in.html");
});

app.get("/:monuName", function (req, res) {
  const monuName = _.capitalize(req.params.monuName);
  // localhost:3000/colosseo ,req.params.customlistname=colosseo
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
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});
