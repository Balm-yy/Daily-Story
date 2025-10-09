const express = require("express");
const cors = require("cors"); //pour autoriser els requêtes du frontend
const app = express();

app.use(cors()) ; // autorise les requêtes entre domaines
app.use(express.json());

app.post("/generate", (req, res) => {
  const { subject } = req.body;
  const text = 'Voici une note pré-fabriquer sur le sujet "${subject}". Ce texte est généré automatiqueemnt côté serveur pour tester la communication.'
  res.json({ text });
});

app.get("/", (req, res) => {
  res.send("Bienvenue sur le serveur !");
});


app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => console.log("✅ Backend running on port 3000"));
