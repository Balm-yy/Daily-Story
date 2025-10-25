// On écoute les requêtes HTTP sur le port 3000

const express = require("express");
const router = express.Router();
const { addStory, getAllStories } = require("../models/storiesModel");

//Add a new story
router.post("/", async (req, res) => {
    try {
        const {subject, content} = req.body;
        console.log("📩 Données reçues :", { subject, content });
        const story = await addStory(subject, content);
        res.json(story);
    } catch (error) {
        console.error("Erreur d'ajout de l'histoire :", error);
        res.status(500).json({error: "Erreur serveur"});
    }
});


//Get all stories
router.get("/", async (req, res) => {
    try {
        const stories = await getAllStories();
        res.json(stories);
    } catch (error) {
        console.error("Erreur lors de la lecture de l'histoire :", error);
        res.status(500).json({error: "Erreur serveur"});
    }
});

module.exports = router;