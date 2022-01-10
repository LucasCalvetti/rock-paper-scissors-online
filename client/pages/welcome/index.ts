import { Router } from "@vaadin/router";

class Welcome extends HTMLElement {
    connectedCallback() {
        this.render();

        this.querySelector(".new-game-button").addEventListener("click", (e) => {
            Router.go("/new-room");
        });
        this.querySelector(".access-room-button").addEventListener("click", (e) => {
            Router.go("/access-room");
        });
    }

    render() {
        this.innerHTML = `
            <div class="welcome__title-container">
                <custom-text tag="h1">Piedra, Papel ó Tijera</custom-text>
            </div>
            <div class="welcome__all-buttons-container">
                <div class="welcome__button-container">
                    <custom-button class="new-game-button">Nuevo Juego</custom-button>
                </div>
                <div class="welcome__button-container">
                    <custom-button class="access-room-button">Ingresar a una sala</custom-button>
                </div>
            </div>
            <div class="welcome__plays-container">
            <my-play type="piedra"></my-play>
            <my-play type="papel"></my-play>
            <my-play type="tijera"></my-play>
            </div>
        `;
        this.classList.add("welcome__main-div-container");
    }
}

customElements.define("welcome-page", Welcome);
