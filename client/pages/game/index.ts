import { Router } from "@vaadin/router";
import { state } from "../../state";

class Game extends HTMLElement {
    connectedCallback() {
        this.renderVisuals();
        this.applyStyles();
        this.declareSelectedPlay();
        this.startCountdown();
    }
    renderVisuals() {
        this.innerHTML = `
        <div class="game__countdown-container">
            <countdown-timer class="test">7</countdown-timer>
        </div>
        <div class="game__player-plays-container">
            <my-play class="game__player-play" type="piedra"></my-play>
            <my-play class="game__player-play" type="papel"></my-play>
            <my-play class="game__player-play" type="tijera"></my-play>
        </div>
        `;
    }
    applyStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
            .player-play.selected {
                animation: move-up 400ms forwards;
            }
            @keyframes move-up {
                0% {
                    opacity: 0.5;
                    transform: translateY(0);
                }
                100% {
                    opacity: 1;
                    transform: translateY(-40px);
                }
            }
            
            .player-play{
                position: relative;
                top: 20px;
                opacity: 0.5;
            }
        `;

        this.querySelector(".game__player-plays-container").appendChild(style);
    }
    declareSelectedPlay() {
        const playerPlaysArray = this.querySelector(".game__player-plays-container").children;
        // Agrego los event listeners a cada una de las jugadas de el/la jugador/a,
        // y agrega la clase "selected"
        for (let p of playerPlaysArray) {
            p.classList.add("player-play");
            p.addEventListener("click", (e) => {
                const thisPlayEl: any = e.target;
                if (thisPlayEl.classList.contains("selected")) {
                    thisPlayEl.classList.remove("selected");
                } else {
                    for (let i of playerPlaysArray) {
                        if (i.classList.contains("selected")) {
                            i.classList.remove("selected");
                        }
                    }
                    thisPlayEl.classList.add("selected");
                }
            });
        }
    }
    startCountdown() {
        let intervalCounter = 8; //tiene que ser el numero del componente "countdown" + 1, en este caso 7+1 (8)
        //                          simplemente para que termine en 0 el contador
        let playerPlayEl: any = this.querySelector(".selected") || "none";
        const countDownInterval = setInterval(() => {
            intervalCounter--;

            playerPlayEl = this.querySelector(".selected") || "none";
            if (intervalCounter == 0) {
                state.setPlay(playerPlayEl.type || "none", () => {
                    state.listenOpponentPlay(() => {
                        window.clearInterval(countDownInterval);
                        Router.go("/result");
                    });
                });
            }
        }, 1000);
    }
}

customElements.define("game-page", Game);
