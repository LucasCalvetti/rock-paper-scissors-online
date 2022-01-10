import { Router } from "@vaadin/router";
import { state } from "../../state";

class Ready extends HTMLElement {
    connectedCallback() {
        this.render(() => {
            const button = document.querySelector(".ready__ready-button");
            button.addEventListener("click", () => {
                state.setReady(true, () => {
                    this.renderReadyTrue();
                });
            });
            state.listenReady();
        });
    }
    render(listener) {
        const { name, opponentName, opponentScore, score, shortId } = state.getState();

        this.innerHTML = `
        <header class="ready__header">
            <div class="ready__score-container">
                <custom-text tag="p" size="24px">${state.data.name}: ${state.data.score}</custom-text>
                <custom-text tag="p" size="24px" style="color: red;">${state.data.opponentName}: ${state.data.opponentScore}</custom-text>
            </div>
            <div class="ready__room-data">
                <custom-text tag="p" size="24px" style="font-weight: 700;">Sala</custom-text>
                <custom-text tag="p" size="24px">${state.data.shortId}</custom-text>
            </div>
        </header>
        <div class="ready__button-and-text-container">
            <div class="ready__text-container">
                <custom-text tag="p" size="35px">Presioná jugar
                y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.</custom-text>
            </div>
            <div class="ready__button-container">
                <custom-button class="ready__ready-button">¡Jugar!</custom-button>
            </div>
        </div>
        <div class="ready__plays-container">
            <my-play class="ready__play" type="piedra"></my-play>
            <my-play class="ready__play" type="papel"></my-play>
            <my-play class="ready__play" type="tijera"></my-play>
        </div>
    `;
        listener();
    }
    renderReadyTrue() {
        const cs = state.getState();
        const container = document.querySelector(".ready__button-and-text-container");
        container.innerHTML = `
        <custom-text tag="p">Esperando que ${cs.opponentName} presione "Jugar".</custom-text>
        `;
    }
}

customElements.define("ready-page", Ready);
