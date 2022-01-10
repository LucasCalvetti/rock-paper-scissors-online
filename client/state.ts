import { Router } from "@vaadin/router";
import { rtdb } from "./rtdb";
const API_BASE_URL = process.env.NODE_ENV === "production" ? "https://piedra-papel-o-tijera-lucas.herokuapp.com" : "http://localhost:3000";

// const API_URL = "http://localhost:3000";

const state = {
    data: {
        name: "",
        opponentName: "",
        userId: "",
        player: "",
        shortId: "",
        rtdbId: "",
        play: "",
        opponentPlay: "",
        score: "",
        opponentScore: "",
        ready: false,
        opponentReady: false,
        online: false,
        opponentOnline: false,
        result: "",
    },
    listeners: [],
    init() {
        const lastStoragedState = localStorage.getItem("state");
    },
    getState() {
        return this.data;
    },
    setState(newState) {
        this.data = newState;
        localStorage.setItem("state", JSON.stringify(newState));
    },
    setName(newName: string) {
        const cs = this.getState();
        cs.name = newName;
        this.setState(cs);
    },
    // SetOnline(Boolean) sirve para cambiar el stado de online del jugador
    // y actualizarlo en la RTDB
    setOnline(boolean: Boolean, callback?) {
        const cs = this.getState();
        cs.online = boolean;
        fetch(API_BASE_URL + "/setOnline", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                rtdbId: cs.rtdbId,
                player: cs.player,
                online: cs.online,
            }),
        });
        this.setState(cs);
        if (callback) callback();
    },
    setReady(boolean: Boolean, callback?) {
        const cs = this.getState();
        cs.ready = boolean;
        fetch(API_BASE_URL + "/setReady", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                rtdbId: cs.rtdbId,
                player: cs.player,
                ready: cs.ready,
            }),
        });
        this.setState(cs);
        if (callback) callback();
    },
    signUp(callback?) {
        const cs = this.getState();
        if (cs.userId == "") {
            fetch(API_BASE_URL + "/signup", {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ name: cs.name }),
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    cs.userId = data.userId;
                    this.setState(cs);
                    if (callback) callback();
                });
        } else {
            console.log("Nombre ya existente");
            if (callback) callback();
        }
    },
    //Crea el chatroom a traves de la API y sobreescribe el State
    createRoom(callback?) {
        const cs = this.getState();
        fetch(API_BASE_URL + "/rooms", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ name: cs.name, userId: cs.userId }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                cs.shortId = data.shortId;
                cs.rtdbId = data.rtdbId;
                cs.player = data.player;
                cs.opponentName = data.opponentName;
                this.setState(cs);
                if (callback) callback();
            });
    },

    //Da acceso a la rtdbId para conectar a la sala
    getRtdbId(shortId: string, callback?) {
        const cs = this.getState();

        fetch(API_BASE_URL + "/rooms/" + shortId + "?userId=" + cs.userId)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                cs.rtdbId = data.rtdbId;
                cs.shortId = shortId;
                this.setState(cs);
                if (callback) callback();
            });
    },
    administratePlayers(callback?) {
        const cs = this.getState();
        fetch(API_BASE_URL + "/rooms/" + cs.rtdbId, {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ name: cs.name, shortId: cs.shortId }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                cs.player = data.player;
                this.setState(cs);
                if (callback) callback();
            });
    },
    getRoomInfo(callback?) {
        const cs = this.getState();
        fetch(API_BASE_URL + "/rooms/" + cs.player + "/" + cs.shortId)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                cs.opponentName = data.opponentName;
                cs.opponentScore = data.opponentScore;
                cs.score = data.score;
                this.setState(cs);
                if (callback) callback();
            });
    },
    //Checkea si estan online ambos o no, si lo estan los redirije a "/ready" page
    // (ver si lo divido en 2 funciones, una que checkee y otra que redirija)
    listenOnline(callback?) {
        const cs = this.getState();
        const roomsRef = rtdb.ref("/rooms/" + cs.rtdbId);

        roomsRef.on("value", (snapshot) => {
            const player2OnlineInfo = snapshot.val().player2.online;
            const player1OnlineInfo = snapshot.val().player1.online;
            if (cs.player == "player1") {
                cs.opponentOnline = player2OnlineInfo;
                this.setState(cs);
            } else {
                cs.opponentOnline = player1OnlineInfo;
                this.setState(cs);
            }
            if (player1OnlineInfo == true && player2OnlineInfo == true && (window.location.pathname == "/waiting" || window.location.pathname == "/access-room")) {
                this.getRoomInfo(() => {
                    Router.go("/ready");
                });
                if (callback) callback();
            }
        });
    },
    listenReady(callback?) {
        const cs = this.getState();
        const roomRef = rtdb.ref("/rooms/" + cs.rtdbId);

        roomRef.on("value", (snapshot) => {
            const player2ReadyInfo = snapshot.val().player2.ready;
            const player1ReadyInfo = snapshot.val().player1.ready;
            if (cs.player == "player1") {
                cs.opponentReady = player2ReadyInfo;
            } else {
                cs.opponentReady = player1ReadyInfo;
            }
            if (player1ReadyInfo == true && player2ReadyInfo == true && window.location.pathname == "/ready") {
                Router.go("/game");
            }
        });
    },
    setPlay(play: string, callback?) {
        const cs = this.getState();
        cs.play = play;
        fetch(API_BASE_URL + "/setPlay", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                rtdbId: cs.rtdbId,
                player: cs.player,
                play: cs.play,
            }),
        });
        this.setState(cs);
        if (callback) callback();
    },
    listenOpponentPlay(callback?) {
        const cs = this.getState();
        const roomRef = rtdb.ref("/rooms/" + cs.rtdbId);

        roomRef.on("value", (snapshot) => {
            var player2Play = snapshot.val().player2.play;
            var player1Play = snapshot.val().player1.play;
            if (cs.player == "player1" && (window.location.pathname == "/result" || window.location.pathname == "/game")) {
                cs.opponentPlay = player2Play;
                this.setState(cs);
                if (callback) callback();
            } else if (cs.player == "player2" && (window.location.pathname == "/result" || window.location.pathname == "/game")) {
                cs.opponentPlay = player1Play;
                this.setState(cs);
                if (callback) callback();
            }
        });
    },

    // Declara la lógica para saber quién ganó, y le suma el score a quien corresponda, y devuelve result
    whoWins(callback?) {
        var cs = this.getState();
        if (cs.play == "none" && cs.opponentPlay != "none") {
            cs.opponentScore++;
            console.log("No elegiste jugada, tu oponente gano un punto");
            cs.result = "perdiste";
            this.setState(cs);
        } else if (cs.play != "none" && cs.opponentPlay == "none") {
            cs.score++;
            console.log("Tu oponente no eligio a tiempo");
            cs.result = "ganaste";
            this.setState(cs);
        } else if (cs.play == "none" && cs.opponentPlay == "none") {
            console.log("Ninguno eligio jugada a tiempo");
            cs.result = "empate";
            this.setState(cs);
        } else {
            const winningOutcomes = [
                { yourPlay: "tijera", opponentPlay: "papel" },
                { yourPlay: "piedra", opponentPlay: "tijera" },
                { yourPlay: "papel", opponentPlay: "piedra" },
            ];
            cs.result = "perdiste";
            for (const o of winningOutcomes) {
                if (o.yourPlay == cs.play && o.opponentPlay == cs.opponentPlay) {
                    cs.score++;
                    cs.result = "ganaste";
                } else if (cs.play == cs.opponentPlay) {
                    cs.result = "empate";
                }
            }
            if (cs.result == "perdiste") {
                cs.opponentScore++;
            }
            this.setState(cs);
            if (callback) callback();
        }
    },
    pushResults(callback?) {
        const cs = this.getState();
        fetch(API_BASE_URL + "/pushResults", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ rtdbId: cs.rtdbId, player: cs.player, score: cs.score, opponentScore: cs.opponentScore, shortId: cs.shortId }),
        })
            .then((res) => {
                return res.json();
            })
            .then(() => {
                if (callback) callback();
            });
    },
    restartGameData(callback?) {
        const cs = this.getState();
        fetch(API_BASE_URL + "/restartGameData", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ rtdbId: cs.rtdbId, player: cs.player }),
        });

        cs.play = "";
        cs.opponentPlay = "";
        cs.result = "";
        cs.ready = ""; //fijarse si esto va
        this.setState(cs);
    },
    suscribe(callback: (any) => any) {
        this.listeners.push(callback);
    },
};

export { state };
