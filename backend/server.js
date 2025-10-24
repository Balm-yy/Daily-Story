const express = require("express");
const cors = require("cors"); //pour autoriser els requêtes du frontend
//const dotenv = require("dotenv");
//const openAI = require("openai");
//dotenv.config();

const app = express();
app.use(cors()) ; // autorise les requêtes entre domaines
app.use(express.json());


// Configuration client OpenAI
/*const client = new openAI({
  apiKey : process.env.HUGGINGFACE_API_KEY,
});*/

// Test Simple
app.get("/", (req, res) => {
  res.send("✅ Backend avec OpenAI est en ligne !");
});

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});


// Endpoint Hugging Face
/*const HF_ENDPOINT = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct";
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
*/


// Route principal pour générer le contenu
app.post("/generate", async (req, res) => {
  const { subject } = req.body;
  const OLLAMA_URL = process.env.OLLAMA_URL || "http://host.docker.internal:11434/api/generate";

  if (!subject) {
    return res.status(400).json({ error: "Aucun sujet fourni"});
  }

  try {
    // Requête POST vers Hugging Face
    console.log("📡 Tentative de connexion à :", OLLAMA_URL);
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model:"mistral",
        prompt: `Rédige un texte informatif et pédagogique en anglais sur le sujet suivant : "${subject}".
Le texte doit être accessible à tous les âges : utilise un langage simple et fluide, mais garde les mots techniques importants en les expliquant brièvement (entre parenthèses ou dans la phrase). Le ton doit être bienveillant, engageant et instructif, comme celui d’un vulgarisateur.
Suis impérativement cette structure :
Titre : [un titre captivant et clair]
Texte principal : [500 à 5000 mots]
Anecdote : [une petite histoire amusante ou surprenante liée au sujet]`,
      }),
    });

    /*
    const data = await response.json();
    res.json({ text: data.response });
*/
    //Lire le flux du texte brut
    const raw = await response.text();

    //Ollama envoie plusieurs ligne : On les découpe
    const lines = raw.trim().split("\n");
    
    //REFORMATAGE DU TEXTE -> Suppression des 3 premières lignes "Ti tre : "
    //lines.splice(0, 3); // a partir de l'index  je supprime 3 éléments

   // On reconstitue le texte dans une variable
   let fullText ="";

   for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.response) {
        fullText += parsed.response; //C'est ici qu'on ajoute chaque partie du texte
      }
    } catch (err) {
      console.log("⚠️ Ligne ignorée (JSON non valide) :", line)
    }
   }

   //Ajout d'un retour à la ligne pour le texte voir même un double retour
   //fullText = fullText.replace(/[:-]/, match => `${match}\n\n`);

    res.json({ text: fullText || "Aucune réponse générée." });

  } catch (error) {
    console.error("❌ Erreur Ollama :", error);
    res.status(500).json({ error: "Erreur lors de la génération du texte."});
  }
});



// Démarrer le serveur
app.listen(3000, () => console.log("✅ Backend running on port 3000"));
//console.log("🔑 Clé Hugging Face détectée :", process.env.HUGGINGFACE_API_KEY ? "OK" : "Manquante");
