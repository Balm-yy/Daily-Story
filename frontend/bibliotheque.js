const popUpBg = document.getElementById("displayed_story");
const storycontainer = document.getElementById("story_container");
const content = document.getElementById("story");
const closeStoryBtn = document.getElementById("close");



// Variable pour stocker l'AbortController de la requête en cours (est en cours de fetch ou pas)
let currentAbortController = null;

//Stocker les histoires récupérées
let stories = [];
let actualMonth = "";
let comparedMonth = "";

// Écouteur d'événement pour le bouton de fermeture de l'histoire
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

async function fetchStory() { 
    // Créer un nouvel AbortController pour cette requête
    const controller = new AbortController();
    currentAbortController = controller;
    
    try {
      const response = await fetch("http://localhost:3000/getStory");
      if (response.ok) {
        console.log("✅ Histoire récupérée avec succès");
        stories = await response.json();
        console.log("📚 Histoires :", stories);
        console.log("📚 Première histoire :", stories[0].created_at);
        organizeLibrary()
        // organizeLibrary(); // Appeler la fonction pour organiser la bibliothèque après avoir récupéré les histoires
      } else {
        console.error("❌ Échec de la récupération de l'histoire :", response.statusText);
      }

    } catch (error) {
      if (error.name === "AbortError") {
        console.log("⚠️ Requête annulée");
      } else {
        console.error("❌ Erreur lors de la récupération des histoires :", error);
      }
}
}


function monthNumberToName(story) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  const monthIndex = parseInt(story.created_at.slice(5, 7), 10) - 1; // Convertir en index (0-11)
  comparedMonth = monthNames[monthIndex];
  //return comparedMonth;
}


async function organizeLibrary() {
  const mainContainer = document.getElementById("main_container");

  // Vider le conteneur principal avant d'ajouter les histoires
  mainContainer.innerHTML = "";
  //stories = []; // Pour test
  //Verifier si des histoires sont présentes dans stories
  if (stories.length === 0) {
    mainContainer.innerHTML = "<p>Aucune histoire disponible.</p> <a href='index.html'><buton>Générer une histoire</button></a>";
    return;
  }
  else if (stories.length === 1) {

    monthNumberToName(stories[0]);
    actualMonth = comparedMonth;
    
      mainContainer.innerHTML += `
          <div id="${actualMonth}" class="month_stories">  
            <div class="months">
                <div class="month">
                    <p class="month_title">${actualMonth}</p>
                </div>
                <div class="viewAll_container">
                    <p class="viewAll_text">View all</p>
                    <div class="viewAll_btn">-></div>
                </div>
            </div> 
            <div class="books">
              <div id="${stories[0].id}" class="book_container" onclick="fetchStory()">
                <div id="${stories[0].id}" class="book" onclick="displayStory(${stories[0].id})">
                  <div class="titles">
                <div class="book-title" onclick="displayStory()">
                  <p class="title">${stories[0].subject}</p>
              </div>
            </div>
          </div>`;

    } else if (stories.length > 1) {
      monthNumberToName(stories[0]);
      actualMonth = comparedMonth;
      mainContainer.innerHTML += `
          <div id="${actualMonth}" class="month_stories">  
            <div class="months">
                <div class="month">
                    <p class="month_title">${actualMonth}</p>
                </div>
                <div class="viewAll_container">
                    <p class="viewAll_text">View all</p>
                    <div class="viewAll_btn">-></div>
                </div>
            </div> 
            <div class="books">
              <div id="${stories[0].id}" class="book_container" onclick="fetchStory()">
                <div id="${stories[0].id}" class="book" onclick="displayStory(${stories[0].id})">
                  <div class="titles">
                <div class="book-title" onclick="displayStory()">
                  <p class="title">${stories[0].subject}</p>
              </div>
            </div>
          </div>`;
          for (let i = 1; i < stories.length; i++) {
            monthNumberToName(stories[i]);
            if (comparedMonth === actualMonth) {
              // Ajouter au même conteneur month_stories
              const booksContainer = document.querySelector(`#${actualMonth} .books`);
              booksContainer.innerHTML += `
                <div id="${stories[i].id}" class="book_container" onclick="fetchStory()">
                  <div id="${stories[i].id}" class="book" onclick="displayStory(${stories[i].id})">
                    <div class="titles">
                  <div class="book-title" onclick="displayStory()">
                    <p class="title">${stories[i].subject}</p>
                </div>`;
          } else if (comparedMonth !== actualMonth) {
              // Créer un nouveau conteneur month_stories
              actualMonth = comparedMonth;
              mainContainer.innerHTML += `
          <div id="${actualMonth}" class="month_stories">  
            <div class="months">
                <div class="month">
                    <p class="month_title">${actualMonth}</p>
                </div>
                <div class="viewAll_container">
                    <p class="viewAll_text">View all</p>
                    <div class="viewAll_btn">-></div>
                </div>
            </div> 
            <div class="books">
              <div id="${stories[i].id}" class="book_container" onclick="fetchStory()">
                  <div id="${stories[i].id}" class="book" onclick="displayStory(${stories[i].id})">
                    <div class="titles">
                  <div class="book-title" onclick="displayStory()">
                    <p class="title">${stories[i].subject}</p>
                </div>
            </div>
          </div>`;
          }
    }
  };
  

}

document.addEventListener("DOMContentLoaded", fetchStory);



async function displayStory(id) { 

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

 try {
    const response = await fetch("http://localhost:3000/displayStory/" + id);

    const raw = await response.text();
    console.log("Réponse brute :", raw);
    const data = JSON.parse(raw);

    //const data = await response.json();
    console.log("✅ Histoire chargée avec succès");

    content.innerHTML = `<p>${data.content}</p>`;
    closeStoryBtn.classList.remove("hidden");




 } catch (error) {
    console.error("❌ Erreur lors du chargement de l'histoire :", error);
    content.innerHTML = "<p>❌ Erreur lors du chargement de l'histoire.</p>";
 }

}