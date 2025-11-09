const pool = require('../db');

//pool.query() envoie la requete à postgreSQL

//Add a story to the database
async function addStory(subject, content) {
    const result = await pool.query(
        "INSERT INTO stories (subject, content) VALUES ($1, $2) RETURNING *",
        [subject, content]
    );
    return result.rows[0];
}


//Get all stories from the database
async function getAllStories() {
    const result = await pool.query("SELECT * FROM stories ORDER BY created_at DESC");
    return result.rows;
}

//Display a story by its ID
async function getStoryId(id) { 
    const result = await pool.query("SELECT * FROM stories WHERE id = $1", [id]);
    return result.rows[0];
}


module.exports = { addStory, getAllStories, getStoryId };  //Export functions to be used in routes/stories.js