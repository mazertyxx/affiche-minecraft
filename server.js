const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

let background = "";

// 📌 events live
app.post("/event", (req, res) => {
    const { type, username } = req.body;

    io.emit("event", { type, username });

    res.sendStatus(200);
});

// 🖼️ upload image background (base64)
app.post("/background", (req, res) => {
    const { image } = req.body;

    background = image;

    io.emit("background", background);

    res.sendStatus(200);
});

// 📤 envoyer background au client
app.get("/background", (req, res) => {
    res.json({ image: background });
});

server.listen(3000, () => {
    console.log("Serveur OK : http://localhost:3000");
});