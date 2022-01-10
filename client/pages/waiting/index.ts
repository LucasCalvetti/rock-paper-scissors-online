import { Router } from "@vaadin/router";
import { state } from "../../state";

class Waiting extends HTMLElement {
    connectedCallback() {
        this.render();

        var countDown: number = 30;
        const countDownInterval = setInterval(() => {
            countDown--;
            if (countDown == 0) {
                this.renderTimesUp();
                document.querySelector(".waiting__back-to-welcome").addEventListener("click", () => {
                    state.setOnline(false, () => {
                        Router.go("/");
                    });
                });
                window.clearInterval(countDownInterval);
            }
        }, 1000);
        state.listenOnline(() => {
            window.clearInterval(countDownInterval);
        });
    }
    render() {
        this.innerHTML = `
            <header class="waiting__header">
                <div class="waiting__score-container">
                    <custom-text tag="p" size="24px">${state.data.name}: ${state.data.score}</custom-text>
                    <custom-text tag="p" size="24px" style="color: red;">${state.data.opponentName}: ${state.data.opponentScore}</custom-text>
                </div>
                <div class="waiting__room-data">
                    <custom-text tag="p" size="24px" style="font-weight: 700;">Sala</custom-text>
                    <custom-text tag="p" size="24px">${state.data.shortId}</custom-text>
                </div>
            </header>
            <div class="waiting__share-info-container">
                <custom-text tag="p" size="35px">Compartí el codigo: </custom-text>
                <custom-text tag="p">${state.data.shortId}</custom-text>
                <custom-text tag="p" size="35px">Con tu oponente.</custom-text>
            </div>
            <div class="waiting__times-up-container"></div>
            <custom-text tag="p" class="waiting__waiting-opponent-text" size="35px">Esperando a tu oponente</custom-text>
            <p class="waiting__waiting-opponent-dots"><span>.</span> <span>.</span> <span>.</span></p>
            <div class="waiting__plays-container">
                <my-play type="piedra"></my-play>
                <my-play type="papel"></my-play>
                <my-play type="tijera"></my-play>
            </div>
        `;
    }
    renderTimesUp() {
        const containerEl = document.querySelector(".waiting__times-up-container");
        containerEl.innerHTML = `
        <custom-text tag="p" size="35px">¿Tardando mucho?</custom-text>
        <custom-button variant="exit" class="waiting__back-to-welcome">Salir al menu principal</custom-button>
        `;
    }
}

customElements.define("waiting-page", Waiting);
