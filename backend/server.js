const express = require("express");
const cors = require("cors"); //pour autoriser els requêtes du frontend
const storiesRoutes = require("./routes/stories")
//const db = require("./db");
//const dotenv = require("dotenv");
//dotenv.config();

const app = express();
app.use(cors()) ; // autorise les requêtes entre domaines
app.use(express.json());



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
        prompt: `You are a helpful educational writer.  
Write an informative and pedagogical text **in English** about the following topic: **"${subject}"**.  

The text must be clear and accessible for all ages — use simple, fluid language,  
but keep technical words and explain them briefly in parentheses.  
Your tone should be kind, engaging, and sound like a science or culture explainer.

---

⚙️ **Mandatory structure (must NEVER change):**

Titre : [A captivating and clear title]  
Texte principal : [500–5000 words of coherent text, formatted into short paragraphs]  
Anecdote : [A short, funny, or surprising story linked to the topic]  
Conclusion : [A concluding reflection with a cultural or practical recommendation]

---

📋 **Formatting rules:**
- At every line break, prepend the symbol '#' to mark it clearly (like markdown).  
- If you write a list, use dashes '-' only, and **add '#' at the end of each item**.  
- Avoid using any other formatting symbols ('*', '_', etc.).  
- Never change the section names — always keep **"Titre :", "Texte principal :", "Anecdote :", "Conclusion :"** exactly in this order and in French.  
- Avoid any additional commentary or explanation outside the text structure.  

---

🎯 **Goal:**
Produce a coherent, engaging, and structured text that can be parsed programmatically by a script.  
Every section must be present, and the total text must be logically consistent.

Example of expected format:

Titre : The Amazing World of Volcanoes#
Texte principal : Volcanoes are openings in the Earth's crust...#
They can erupt violently or gently...#
Anecdote : Once, in Iceland, a volcano stopped all flights across Europe...#
Conclusion : Volcanoes remind us of Earth's power and beauty.#
`,
      }),
    });

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

   fullText = fullText
      .replaceAll("#", "\n")
      .replace(/Titre ?: ?/gi, "<h2>")
      .replace(/Texte principal ?: ?/gi, "</h2><p>")
      .replace(/Anecdote ?: ?/gi, "</p><h3>Anecdote :</h3><p>")
      .replace(/Conclusion ?: ?/gi, "</p><h3>Conclusion :</h3><p>") + "</p>";

    res.json({ text: fullText || "Aucune réponse générée." });

  } catch (error) {
    console.error("❌ Erreur Ollama :", error);
    res.status(500).json({ error: "Erreur lors de la génération du texte."});
  }
});


app.use("/stories", storiesRoutes)


// Démarrer le serveur
app.listen(3000, () => console.log("✅ Backend running on port 3000"));
//console.log("🔑 Clé Hugging Face détectée :", process.env.HUGGINGFACE_API_KEY ? "OK" : "Manquante");
