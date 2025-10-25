const popUpBg = document.getElementById("background_popUp");
const resultContainer = document.getElementById("result_container");
const resultBox = document.getElementById("result");
const closePopUpBtn = document.getElementById("close");

// Variable pour stocker l'AbortController de la requête en cours (est en cours de fetch ou pas)
let currentAbortController = null;

closePopUpBtn.addEventListener("click", () => {
  // annuler une requête en cours si nécessaire (empêche 2 fetch simultanés)
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }

  popUpBg.classList.add("hidden");
  closePopUpBtn.classList.add("hidden");
  resultBox.onscroll = null;
  resultBox.innerHTML = "";
});

function resetPrevious() {
  // annuler requête précédente (supprimer le fetch en cours)
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
  // supprimer listener et vider l'affichage
  resultBox.onscroll = null;
  resultBox.innerHTML = "";
  closePopUpBtn.classList.add("hidden");

  // s'assurer que le body n'est pas bloqué
  document.body.classList.remove("no-scroll");
}

async function sendSubject() {
  // Réinitialiser le contenu précédent
  resetPrevious();

  const subject = document.getElementById("subject").value.trim();

  popUpBg.classList.remove("hidden");
  // Bloquer le scroll du body pendant que la popup est ouverte
  document.body.classList.add("no-scroll");
  closePopUpBtn.classList.add("hidden");

  //Ajouter une animation de chargement
  resultContainer.style.background = "#1a1a1a";
  resultContainer.style.border = "none";
  //resultBox.innerHTML = "<p>⏳ Génération du texte en cours, merci de patienter...</p>";
  resultBox.innerHTML = `
    <div class="loader" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <div class="loader-text">Génération du texte en cours, merci de patienter...</div>
  `;

  if (!subject) {
    resultBox.innerHTML = "<p>⚠️ Merci d'entrer un sujet avant de continuer.</p>";
    return;
  }

  try {
    // Créer un nouveau controller pour cette requête spécifique
    const controller = new AbortController();
    currentAbortController = controller;

    const response = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject }),
      signal: controller.signal,
    });

    // Reinitialisation du controller une fois la requête terminée (fetch inactif)
    currentAbortController = null;

    const data = await response.json();

    if (data.text) {
      // on supprime le vieux texte s’il existait
      resultBox.onscroll = null;
      resultContainer.classList.remove("waiting");
      resultContainer.style.background = "var(--gradient-primary)";
      resultContainer.style.border = "1px solid var(--gradient-accent)";

      resultBox.innerHTML = `<p id="textAdded">${data.text}</p>`;

      // ✅ on ajoute un seul listener à chaque réponse
      resultBox.onscroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = resultBox;

        if (scrollTop + clientHeight >= scrollHeight - 5) {
          closePopUpBtn.classList.remove("hidden");
        } else {
          closePopUpBtn.classList.add("hidden");
        }
      };
    } else {
      resultBox.innerHTML = "<p>❌ Aucune réponse reçue du serveur.</p>";
    }

  } catch (error) {
    // si la requête a été annulée, ne pas afficher d'erreur utilisateur
    if (error.name === "AbortError") {
      return;
    }
    console.error("Erreur frontend :", error);
    resultBox.innerHTML = "<p>⚠️ Erreur de connexion au serveur.</p>";
  }
}
