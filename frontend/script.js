const btn = document.getElementById("input_btn");
const input = document.getElementById("subject");
const output = document.getElementById("result");

btn.addEventListener("click", async () => {
    const subject = input.value.trim();   /*What's trim() -> remove useless spaces (before / after)*/

    if (!subject) {                 /* If there is no subject */
        output.textContent = "Pleaser enter a subject."
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json"},   /* ??? */
            body: JSON.stringify({ subject }),
        });

        const data = await response.json();
        output.textContent = data.text;
    } catch (error) {
        output.textContent = "Error with the server communication";
        console.error(error)
    }

});