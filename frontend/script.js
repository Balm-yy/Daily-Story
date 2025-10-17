async function sendSubject() {
  const subject = document.getElementById("subject").value.trim();
  const resultBox = document.getElementById("result")

  if (!subject) {
    resultBox.innerHTML = "<p>⚠️ Merci d'entrer un sujet avant de continuer.</p>";
    return;
  }

  // Message de chargement - A animer later 
  resultBox.innerHTML = "<p>⏳ Génération en cours...</p>";

  try {
    const response = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ subject }),
    });

    const data = await response.json();

    if (data.text) {
      resultBox.innerHTML = `<p>${data.text}</p>`;
    } else {
      resultBox.innerHTML = "<p>❌ Aucune réponse reçue du serveur.</p>"
    }

  } catch (error) {
    console.error("Erreur frontend :", error);
    resultBox.innerHTML = "<p>⚠️ Erreur de connexion au serveur.</p>"
    }

  }



