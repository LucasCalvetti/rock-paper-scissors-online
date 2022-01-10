import { Router } from "@vaadin/router";
import { state } from "../../state";

class Score extends HTMLElement {
    connectedCallback() {
        state.pushResults();
        this.render(() => {
            const playAgainButton = document.querySelector(".score__play-again-button");
            const goToWelcomeButton = document.querySelector(".score__back-to-welcome-button");
            playAgainButton.addEventListener("click", () => {
                Router.go("/waiting"); //fijarse si esta bien ir a ready u otra page
            });
            goToWelcomeButton.addEventListener("click", () => {
                Router.go("/");
            });
        });
        state.restartGameData();
    }
    render(listener?) {
        const { name, opponentName, opponentScore, score, result } = state.getState();

        this.innerHTML = `
        <div class="score__result-img-container">
            <result-img result=${result}>${result.charAt(0).toUpperCase() + result.slice(1)}</result-img>
        </div>
        <div class="score__score-container">
            <custom-text tag="h2">Score</custom-text>
            <custom-text tag="span">${name}: ${score}</custom-text>
            <custom-text tag="span">${opponentName}: ${opponentScore}</custom-text>
        </div>
        <div class="score__buttons-container">
            <custom-button class="score__play-again-button">Volver a Jugar</custom-button>
            <custom-button class="score__back-to-welcome-button" variant="exit">Salir de la sala</custom-button>
        </div>
        `;
        listener();
    }
}

customElements.define("score-result", Score);
