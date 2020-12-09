const express = require("express");
const path = require("path");
const fs = require("fs");
const data = require("./db/db.json");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3070;

// Data for notes

// let notes = [];

app.use(express.static("public"));
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTML GET
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// API GET
app.get("/api/notes", (req, res) => res.json(notes));

//API POST
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  // console.log("running post");
  newNote.id = uuidv4();
  data.push(newNote);
  console.log(newNote);

  fs.writeFile("./db/db.json", JSON.stringify(data), () => res.json(data));
});

app.listen(PORT, () => console.log(`${PORT} is listening`));
