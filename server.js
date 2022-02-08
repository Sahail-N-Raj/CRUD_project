const express = require("express");
const exhbs = require("express-handlebars");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const app = express();

//connect database
let localDatabase = "mongodb://localhost:27017/notes_app";

mongoose.connect(localDatabase, (err, info) => {
  if (err) throw err;
  console.log("database connected");
});

//import structure or mongoose schema
require("./Model/Note");
const NOTE = mongoose.model("note_schema");

// set template  engine
app.engine("handlebars", exhbs.engine());
app.set("view engine", "handlebars");

//server static file like css , images , client side javascript files
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true })); //parsing incoming request

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

//ALL GET REQUEST STARTS HERE
app.get("/", (req, res) => {
  res.render("./home");
});
app.get("/add-note", (req, res) => {
  res.render("./notes/addNote");
});

app.get("/fetch-data", async (req, res) => {
  let DATA = await NOTE.find({}).lean();
  res.render("./notes/GetNote", { DATA });
});

app.get("/edit-note/:id", async (req, res) => {
  let findId = await NOTE.findOne({ _id: req.params.id }).lean();
  res.render("./notes/EditNote", { findId });
  console.log(findId);
});

//ALL GET REQUEST ENDED HERE

//ALL POST REQUEST STARTS HERE
app.post("/add-note", async (req, res) => {
  let { note_name, note_description } = req.body;
  let errors = [];
  if (!note_name) {
    errors.push({
      errorText: "Note name is Required",
    });
  }
  if (!note_description) {
    errors.push({
      errorText: "Note Description  is Required",
    });
  }
  if (errors.length > 0) {
    res.render("./notes/addNote", { errors });
  } else {
    //save note data from server into mongodb database
    let SaveDATA = { note_name, note_description };
    await new NOTE(SaveDATA).save();
    res.redirect("/fetch-data", 301);
  }
});
//ALL POST REQUEST ENDED HERE

//ALL PUT REQUEST STARTS
app.put("/edit-note/:id", async (req, res) => {
  let editData = await NOTE.findOne({ _id: req.params.id });
  //update
  let { note_name, note_description } = req.body;
  editData.note_name = note_name;
  editData.note_description = note_description;
  //save new data into database
  editData.save();
  res.redirect("/fetch-data", 301);
});

//delete request
app.delete("/delete-note/:id", async (req, res) => {
  await NOTE.remove({ _id: req.params.id });
  res.redirect("/fetch-data", 301);
});

app.listen(5000, err => {
  if (err) throw err;
  console.log("app is running on port number 5000");
});
