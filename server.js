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

// 📌 event live
app.post("/event", (req, res) => {

    const { type, username } = req.body;

    if (type === "sub") latestSub = username;
    if (type === "follow") latestFollow = username;

    history.unshift({ type, username });

    if (history.length > 100) history.pop();

    io.emit("event", { type, username });
    io.emit("history", history);

    res.sendStatus(200);
});

// ❌ suppression
app.post("/delete", (req, res) => {

    const { index } = req.body;

    history.splice(index, 1);

    io.emit("history", history);

    res.sendStatus(200);
});

// 🖼️ fond upload
app.post("/background", (req, res) => {

    const { image } = req.body;

    background = image;

    io.emit("background", background);

    res.sendStatus(200);
});

// 📤 fond
app.get("/background", (req, res) => {
    res.json({ image: background });
});

// 📤 derniers pseudos
app.get("/latest", (req, res) => {
    res.json({
        sub: latestSub,
        follow: latestFollow
    });
});

// 📤 historique
app.get("/history", (req, res) => {
    res.json(history);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Serveur OK : http://localhost:" + PORT);
});
