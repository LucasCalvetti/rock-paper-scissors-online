import { Router } from "@vaadin/router";
import { state } from "../../state";

class AccessRoom extends HTMLElement {
    connectedCallback() {
        this.render();
        const form = document.querySelector(".access-room__form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const target = e.target as any;
            const name = target.name.value;
            const room = target.room.value;
            state.setName(name);
            state.signUp(() => {
                state.getRtdbId(room, () => {
                    state.administratePlayers(() => {
                        state.setOnline(true, () => {
                            state.listenOnline();
                        });
                    });
                });
            });
        });
    }
    render() {
        this.innerHTML = `
            <div class="access-room__title-container">
                <custom-text tag="h1">Piedra, Papel ó Tijera</custom-text>
            </div>
            <form class="access-room__form">
                <div class="access-room__input-with-button-container">
                    <div class="access-room__input-container">
                        <input class="access-room__input-name" name="name" type="text" maxlength = "40" placeholder="Mi nombre es..." />
                    </div>
                    <div class="access-room__input-container">
                        <input class="access-room__input-room" name="room" type="text" maxlength = "6" placeholder="Código de la sala." />
                    </div>
                    <button style="background-color: transparent; width: 100%; border: none;"><custom-button class="start-button">Ingresar a la sala</custom-button></button>
                </div>
            </form>
            <div class="access-room__plays-container">
                <my-play type="piedra"></my-play>
                <my-play type="papel"></my-play>
                <my-play type="tijera"></my-play>
            </div>
        `;
    }
}

customElements.define("access-room", AccessRoom);
