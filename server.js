const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

// 🖼️ fond
let background = "/image.jpg";

// 💾 derniers pseudos
let latestSub = "Aucun";
let latestFollow = "Aucun";

// 📜 historique
let history = [];

// 📌 events live
app.post("/event", (req, res) => {

    const { type, username } = req.body;

    // sauvegarder derniers pseudos
    if (type === "sub") {
        latestSub = username;
    }

    if (type === "follow") {
        latestFollow = username;
    }

    // ajouter historique
    history.unshift({
        type,
        username
    });

    // max 40 lignes
    if (history.length > 40) {
        history.pop();
    }

    // envoyer aux clients
    io.emit("event", {
        type,
        username
    });

    res.sendStatus(200);
});

// 🖼️ changer fond
app.post("/background", (req, res) => {

    const { image } = req.body;

    background = image;

    io.emit("background", background);

    res.sendStatus(200);
});

// 📤 envoyer fond
app.get("/background", (req, res) => {

    res.json({
        image: background
    });

});

// 📤 envoyer derniers pseudos
app.get("/latest", (req, res) => {

    res.json({
        sub: latestSub,
        follow: latestFollow
    });

});

// 📤 envoyer historique
app.get("/history", (req, res) => {

    res.json(history);

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log("Serveur OK : http://localhost:" + PORT);

});
