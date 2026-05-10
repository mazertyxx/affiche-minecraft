const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

// 🖼️ fond actuel
let background = "/image.jpg";

// 💾 derniers pseudos
let latestSub = "Aucun";
let latestFollow = "Aucun";

// 📌 events live
app.post("/event", (req, res) => {

    const { type, username } = req.body;

    // sauvegarde pseudo
    if (type === "sub") {
        latestSub = username;
    }

    if (type === "follow") {
        latestFollow = username;
    }

    // envoyer au site
    io.emit("event", {
        type,
        username
    });

    res.sendStatus(200);
});

// 🖼️ upload image background
app.post("/background", (req, res) => {

    const { image } = req.body;

    background = image;

    io.emit("background", background);

    res.sendStatus(200);
});

// 📤 envoyer background au client
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

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log("Serveur OK : http://localhost:" + PORT);

});
