//express dependency
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const database = require("./db/db.json");
const { RSA_NO_PADDING } = require("constants");

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
app.get("/api/notes", (req, res) => res.json(database));

//post entered notes to db.json
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  database.push(newNote);
  fs.writeFile("./db/db.json", JSON.stringify(database), () =>
    res.json(database)
  );
});

//------------------------------------------------------------------------
//BONUS: delete note functionality
app.delete("/api/notes/:id", (req, res) => {
  const newArray = database.filter((note) => note.id !== req.params.id);
  console.log(newArray);
  fs.writeFile("./db/db.json", JSON.stringify(newArray), () =>
    res.redirect("/notes")
  );
});
//-----------------------------------------------------------------------

//get main page index.html
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

//server listener
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
