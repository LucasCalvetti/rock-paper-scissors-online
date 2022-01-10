import { Router } from "@vaadin/router";
import { state } from "../../state";

class Result extends HTMLElement {
    connectedCallback() {
        const Interval1 = setInterval(() => {
            this.render();
            state.whoWins();
            window.clearInterval(Interval1);
            const Interval2 = setInterval(() => {
                Router.go("/score");
                window.clearInterval(Interval2);
            }, 3000);
        }, 1000);
    }
    render() {
        const cs = state.getState();

        this.innerHTML = `
        <div class="result__show-both-plays-container">
            <div class="result__play-container">
                <my-play class="result__opponent-play result__fade-in-down" type=${cs.opponentPlay} opponent="true"></my-play>
            </div>
            <div class="result__play-container">
                <my-play class="result__player-play result__fade-in-up" type=${cs.play}></my-play>
            </div>
        </div>
        `;
    }
}

customElements.define("result-page", Result);
