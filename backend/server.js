const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bienvenue sur le serveur !");
});


app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => console.log("✅ Backend running on port 3000"));
