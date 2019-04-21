const low = require("lowdb");
const path = require("path");
const cors = require("cors");
const uuid = require("uuid/v4");
const express = require("express");
const bodyParser = require("body-parser");
const FileSync = require("lowdb/adapters/FileSync");

const PORT = 8080;

// Setup application
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Setup database
const db = low(new FileSync("db.json"));
db.defaults({
  humidity: [],
  temperature: [],
  pressure: []
}).write();

// API
app.get("/api/humidity", (req, res) => res.send(db.get("humidity").value()));

app.get("/api/humidity/last", (req, res) =>
  res.send(
    db
      .get("humidity")
      .last()
      .value() || null
  )
);

app.get("/api/temperature", (req, res) =>
  res.send(db.get("temperature").value())
);

app.get("/api/temperature/last", (req, res) =>
  res.send(
    db
      .get("temperature")
      .last()
      .value() || null
  )
);

app.get("/api/pressure", (req, res) => res.send(db.get("pressure").value()));
app.get("/api/pressure/last", (req, res) =>
  res.send(
    db
      .get("pressure")
      .last()
      .value() || null
  )
);

app.post("/api/humidity", (req, res) => {
  db.get("humidity")
    .push({ ...req.body, id: uuid() })
    .write();

  return res.status(201).send();
});

app.post("/api/temperature", (req, res) => {
  db.get("temperature")
    .push({ ...req.body, id: uuid() })
    .write();

  return res.status(201).send();
});

app.post("/api/pressure", (req, res) => {
  db.get("pressure")
    .push({ ...req.body, id: uuid() })
    .write();

  return res.status(201).send();
});

app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname + "/public/index.html"))
);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
