const express = require("express");
const path = require("path");
const fs = require("fs");

// Gives each note a UNIQUE ID (npm package)
const { v4: uuidv4 } = require("uuid");

const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3070;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// HTML GET - returns the notes.html
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

// API GET - Gets all saved notes and returns them as JSON
app.get("/api/notes", (req, res) => {
  readFileAsync("./db/db.json", "utf8").then((notes) => {
    let pNotes = JSON.parse(notes);
    res.json(pNotes);
  });
});

//API POST - Receives a note and saves that newNote on the req.body, added to db.json then pushed/written
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  readFileAsync("./db/db.json", "utf8").then((notes) => {
    let parseNotes = JSON.parse(notes);
    let updatedNotes = [...parseNotes, newNote];
    // data.push(newNote);
    writeFileAsync(
      "./db/db.json",
      JSON.stringify(updatedNotes)
    ).then((updatedNotes) => res.json(updatedNotes));
  });
});

// This DELETE Method (express) receives a request with an id from req.params and is stored in CONST ID.
// The request is read from the db.json file then parsed into an object and filtered up against ID's. If the ID is not req.params.id a delete can be processed.

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  readFileAsync("./db/db.json", "utf8").then((notes) => {
    let parseNotes = JSON.parse(notes);
    let updatedNotes = parseNotes.filter((note) => note.id !== id);
    // console.log(updatedNotes);
    writeFileAsync(
      "./db/db.json",
      JSON.stringify(updatedNotes)
    ).then((updatedNotes) => res.json(updatedNotes));
  });
});

// HTML GET - returns the index.html
// CATCH ALL - If nothing is loaded/chosen
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.listen(PORT, () => console.log(`${PORT} is listening`));
