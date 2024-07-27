import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const { Client } = pg;

const db = new Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "freelancer2024",
  port: 5432,
});

const app = express();
const port = 3000;

let players = [];
let totalScore = 0; // Initialize total score

// Define a function to fetch players asynchronously
const fetchPlayers = () => {
  return new Promise((resolve, reject) => {
    db.connect()
      .then(() => db.query("SELECT * FROM players"))
      .then((result) => {
        players = result.rows;
        resolve(); // Resolve the promise when players are fetched
      })
      .catch((err) => {
        console.error("Error executing query", err.stack);
        reject(err); // Reject the promise if there's an error
      })
      .finally(() => {
        db.end();
      });
  });
};

// Start the server after fetching players
fetchPlayers()
  .then(() => {
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({ extended: true }));

    app.set("view engine", "ejs"); // Set EJS as the template engine

    let selectedPlayer = null; // Variable to store the selected player

    app.get("/", (req, res) => {
      // Generate a random index only if selectedPlayer is null
      if (!selectedPlayer) {
        const randomIndex = Math.floor(Math.random() * players.length);
        selectedPlayer = players[randomIndex];
      }
      console.log(selectedPlayer);
      res.render("index", { index: selectedPlayer.id, name: selectedPlayer.name, totalScore });
    });

    app.post("/check", (req, res) => {
      const userInput = Array.from({ length: selectedPlayer.name.length }, (_, i) =>
        // Filter out spaces and convert to uppercase
        req.body[`inputContent${i + 1}`].replace(/\s/g, '').toUpperCase()
      );

      const correctAnswer = Array.from(selectedPlayer.name, (letter) => letter.toUpperCase());

      console.log(userInput);
      console.log(correctAnswer);

      const isCorrect = userInput.every((letter, index) => letter === correctAnswer[index]);
      console.log(isCorrect);

      // Update total score based on correctness
      if (isCorrect) {
        totalScore += 1;
      }
      else totalScore=0;

      // Render the "result.ejs" file with the result and total score
      res.render("result.ejs", { isCorrect, totalScore });
    });

    app.get("/generate", (req, res) => {
      // Generate a new random player
      const randomIndex = Math.floor(Math.random() * players.length);
      const randomPlayer = players[randomIndex];

      // Remove spaces from the player's name
      const playerNameWithoutSpaces = randomPlayer.name.replace(/\s/g, '');

      // Assign the modified player to selectedPlayer
      selectedPlayer = { ...randomPlayer, name: playerNameWithoutSpaces };

      // Redirect to the home page to display the new player
      res.redirect("/");
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    // Handle errors if necessary
    console.error("Failed to start the server:", err);
  });
