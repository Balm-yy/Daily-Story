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

module.exports = { addStory, getAllStories };  //Export functions to be used in routes/stories.js