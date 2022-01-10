import { Router } from "@vaadin/router";
import { state } from "../../state";

class NewRoom extends HTMLElement {
    connectedCallback() {
        const cs = state.getState();
        if (cs.name == "" && cs.userId == "") {
            this.render();
            const form = document.querySelector(".new-room__form");
            const containterEl = document.querySelector(".new-room__input-with-button-container");
            const span = document.querySelector(".new-room__span-helper");
            const style = document.createElement("style");
            style.innerHTML = `
        .blink {
            animation: blink-animation 1s steps(5, start) infinite;
            -webkit-animation: blink-animation 1s steps(5, start) 3;
            }
            @keyframes blink-animation {
            to {
                visibility: hidden;
            }
            }
            @-webkit-keyframes blink-animation {
            to {
                visibility: visible;
            }
            }
        `;
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const target = e.target as any;
                if (target.name.value == "") {
                    span.textContent = "Introduzca un nombre, por favor.";
                    span.appendChild(style);
                    span.className = "blink";
                } else {
                    state.setName(target.name.value);
                    state.signUp(() => {
                        state.createRoom(() => {
                            state.administratePlayers(() => {
                                state.setOnline(true, () => {
                                    Router.go("/waiting");
                                });
                            });
                        });
                    });
                }
            });
        } else {
            console.log(cs);
            state.createRoom(() => {
                state.administratePlayers(() => {
                    state.setOnline(true, () => {
                        Router.go("/waiting");
                    });
                });
            });
        }
    }
    render() {
        this.innerHTML = `
            <div class="new-room__title-container">
                <custom-text tag="h1">Piedra, Papel ó Tijera</custom-text>
            </div>
            <form class="new-room__form">
                <custom-text class="new-room__label" tag="span">Tu nombre:</custom-text>
                <div class="new-room__input-with-button-container">
                    <div class="new-room__input-container">
                        <input class="new-room__input" name="name" maxlength = "40" type="text" placeholder="Me llamo..." />
                    </div>
                    <span class="new-room__span-helper"></span>
                    <button style="background-color: transparent; width: 100%; border: none;"><custom-button class="start-button">Empezar</custom-button></button>
                </div>
            </form>
            <div class="new-room__plays-container">
                <my-play type="piedra"></my-play>
                <my-play type="papel"></my-play>
                <my-play type="tijera"></my-play>
            </div>
        `;
        this.classList.add("new-room__main-div-container");
    }
}

customElements.define("new-room", NewRoom);
