//express dependency
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const database = require("./db/db.json");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//express app setup
const app = express();
const PORT = process.env.PORT || 7000;

//Middleware
app.use(express.static("public"));
app.use(express.json());

//GET / POST ROUTES /
//get notes page notes.html
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

//get for notes API
app.get("/api/notes", (req, res) => {
  readFileAsync("./db/db.json", "utf8").then((notes) => {
    let notesArray = JSON.parse(notes);
    res.json(notesArray);
  });
});

//post entered notes to db.json
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  database.push(newNote);
  fs.writeFile("./db/db.json", JSON.stringify(database), () =>
    res.json(database)
  );
});

//get main page index.html
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

//------------------------------------------------------------------------
//BONUS: delete note functionality
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  readFileAsync("./db/db.json", "utf8").then((notes) => {
    let parseNotes = JSON.parse(notes);
    let updatedNotes = parseNotes.filter((note) => note.id !== id);
    console.log(updatedNotes);
    writeFileAsync(
      "./db/db.json",
      JSON.stringify(updatedNotes)
    ).then((updatedNotes) => res.json(updatedNotes));
  });
});
//-----------------------------------------------------------------------

//server listener
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
