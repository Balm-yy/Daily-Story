const popUpBg = document.getElementById("displayed_story");
const storycontainer = document.getElementById("story_container");
const content = document.getElementById("story");
const closeStoryBtn = document.getElementById("close");

// Variable pour stocker l'AbortController de la requête en cours (est en cours de fetch ou pas)
let currentAbortController = null;

closeStoryBtn.addEventListener("click", () => {
    // annuler une requête en cours si nécessaire (empêche 2 fetch simultanés)
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
  popUpBg.classList.add("hidden");
  closeStoryBtn.classList.add("hidden");
  content.onscroll = null;
  content.innerHTML = "";

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


async function displayStory() { 
    // Réinitialiser le contenu précédent
    //resetPrevious();
    popUpBg.classList.remove("hidden");
    storycontainer.classList.remove("hidden");
    // Bloquer le scroll du body pendant que la popup est ouverte
    document.body.classList.add("no-scroll");
    closeStoryBtn.classList.add("hidden");

    //Ajouter une animation de chargement
  storycontainer.style.background = "#1a1a1a";
  storycontainer.style.border = "none";
  //resultBox.innerHTML = "<p>⏳ Histoire en cours de chargement</p>";
  content.innerHTML = `
    <div class="loader" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <div class="loader-text">⏳ Histoire en cours de chargement</div>
  `;

}