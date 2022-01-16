import * as express from "express";
import { firestore, rtdb } from "./dbconfig";
import * as cors from "cors";
import { nanoid } from "nanoid";
import * as path from "path";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

const usersCollection = firestore.collection("users");
const roomCollection = firestore.collection("rooms");

// Registrando un nuevo User
app.post("/signup", function (req, res) {
    const { name } = req.body;
    usersCollection
        .where("name", "==", name)
        .get()
        .then((searchResponse) => {
            if (searchResponse.empty) {
                usersCollection
                    .add({
                        name,
                    })
                    .then((newUserRef) => {
                        res.json({
                            userId: newUserRef.id,
                        });
                    });
            } else {
                res.json({
                    userId: searchResponse.docs[0].id,
                });
            }
        });
});

// Pide un usuario y nombre, lo verifica, crea una ref en la realtime Database,
//  y aguarda el id de esta, en un id corto en firebase, para facilitar su uso.
app.post("/rooms", (req, res) => {
    const { userId } = req.body;
    const { name } = req.body;
    usersCollection
        .doc(userId.toString())
        .get()
        .then((doc) => {
            if (doc.exists) {
                const roomRef = rtdb.ref("rooms/" + nanoid());
                roomRef
                    .set({
                        player1: {
                            name: name,
                            ready: false,
                            play: "",
                            score: 0,
                            online: false,
                        },
                        player2: {
                            name: "Oponente",
                            ready: false,
                            play: "",
                            score: 0,
                            online: false,
                        },
                    })
                    .then(() => {
                        const rtdbId = roomRef.key;
                        const shortId = 100000 + Math.floor(Math.random() * 99999);
                        roomCollection
                            .doc(shortId.toString())
                            .set({
                                rtdbId: rtdbId,
                                player1: name,
                                p1score: 0,
                                player2: "Oponente",
                                p2score: 0,
                            })
                            .then(() => {
                                res.json({
                                    rtdbId: rtdbId,
                                    shortId: shortId.toString(),
                                    player: "player1",
                                    opponentName: "Oponente",
                                });
                            });
                    });
            } else {
                res.status(401).json({
                    message: "no existís.",
                });
            }
        });
});

app.get("/rooms/:shortId", (req, res) => {
    const { userId } = req.query;
    const { shortId } = req.params;
    usersCollection
        .doc(userId.toString())
        .get()
        .then((doc) => {
            if (doc.exists) {
                roomCollection
                    .doc(shortId)
                    .get()
                    .then((snap) => {
                        const data = snap.data();
                        res.json(data);
                    });
            } else {
                res.status(401).json({
                    message: "no existís",
                });
            }
        });
});
//administratePlayers
app.post("/rooms/:rtdbId", (req, res) => {
    const { rtdbId } = req.params;
    const { shortId } = req.body;
    const { name } = req.body;
    roomCollection
        .doc(shortId.toString())
        .get()
        .then((doc) => {
            const data = doc.data();
            if (data.player1 == name) {
                const p1RoomRef = rtdb.ref("/rooms/" + rtdbId + "/player1");
                p1RoomRef.update({
                    name: name,
                });
                roomCollection.doc(shortId.toString()).update({
                    player1: name,
                });
                res.json({
                    player: "player1",
                });
            } else if (data.player2 == "Oponente") {
                const p2RoomRef = rtdb.ref("/rooms/" + rtdbId + "/player2");
                p2RoomRef.update({
                    name: name,
                });
                roomCollection.doc(shortId.toString()).update({
                    player2: name,
                });
                res.json({
                    player: "player2",
                });
            } else if (data.player2 == name) {
                const p2RoomRef = rtdb.ref("/rooms/" + rtdbId + "/player1");
                p2RoomRef.update({
                    name: name,
                });
                roomCollection.doc(shortId.toString()).update({
                    player2: name,
                });
                res.json({
                    player: "player2",
                });
            } else if (data.player1 != name || data.player2 != name) {
                res.json({
                    message: "Tu nombre de usuario no pertenece a esta sala",
                });
            }
        });
});

app.get("/rooms/:player/:shortId", (req, res) => {
    const { shortId } = req.params;
    const { player } = req.params;
    roomCollection
        .doc(shortId.toString())
        .get()
        .then((doc) => {
            const data = doc.data();
            if (player == "player1") {
                res.json({
                    opponentName: data.player2,
                    opponentScore: data.p2score,
                    score: data.p1score,
                });
            } else {
                res.json({
                    player: "player2",
                    opponentName: data.player1,
                    opponentScore: data.p1score,
                    score: data.p2score,
                });
            }
        });
});

app.post("/setOnline", (req, res) => {
    const { rtdbId } = req.body;
    const { player } = req.body;
    const { online } = req.body;
    const roomRef = rtdb.ref("rooms/" + rtdbId + "/" + player);
    roomRef.update({
        online: online,
    });
    res.json({
        online: online,
    });
});
app.post("/setReady", (req, res) => {
    const { rtdbId } = req.body;
    const { player } = req.body;
    const { ready } = req.body;
    const roomRef = rtdb.ref("rooms/" + rtdbId + "/" + player);
    roomRef.update({
        ready: ready,
    });
    res.json({
        ready: ready,
    });
});
app.post("/setPlay", (req, res) => {
    const { rtdbId } = req.body;
    const { player } = req.body;
    const { play } = req.body;
    const roomRef = rtdb.ref("rooms/" + rtdbId + "/" + player);
    roomRef.update({
        play: play,
    });
    res.json({
        play: play,
    });
});
app.post("/pushResults", (req, res) => {
    const { rtdbId } = req.body;
    const { player } = req.body;
    const { score } = req.body;
    const { opponentScore } = req.body;
    const { shortId } = req.body;

    const roomRef = rtdb.ref("/rooms/" + rtdbId + "/" + player);
    roomRef.update({ score: score });
    if (player == "player1") {
        roomCollection
            .doc(shortId.toString())
            .update({
                p1score: score,
                p2score: opponentScore,
            })
            .then(() => {
                res.json({
                    p1score: score,
                });
            });
    }
    if (player == "player2") {
        roomCollection
            .doc(shortId.toString())
            .update({
                p1score: opponentScore,
                p2score: score,
            })
            .then(() => {
                res.json({
                    p2score: score,
                });
            });
    }
});
app.post("/restartGameData", (req, res) => {
    const { rtdbId } = req.body;
    const { player } = req.body;
    const roomRef = rtdb.ref("/rooms/" + rtdbId + "/" + player);
    roomRef.update({
        play: "",
        ready: "", //fijarse si va o no esto
    });
    res.json({
        message: "Restart data completed",
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
    console.log("Funcionando en http://localhost:" + port);
});
