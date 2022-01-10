export function initPlay() {
    const imgPapel = require("url:../../img/papel.png");
    const imgTijera = require("url:../../img/tijera.png");
    const imgPiedra = require("url:../../img/piedra.png");

    customElements.define(
        "my-play",
        class MyPlay extends HTMLElement {
            shadow: ShadowRoot;
            type: string;
            opponent: boolean = false;

            constructor() {
                super();
                this.shadow = this.attachShadow({ mode: "open" });
                this.type = this.getAttribute("type");
                this.opponent = JSON.parse(this.getAttribute("opponent")) || false;
            }
            connectedCallback() {
                this.render();
            }
            render() {
                const style = document.createElement("style");
                style.innerHTML = `
            .rotate{
                transform: scaleY(-1);
            }
            .play{
                overflow: auto;
                width: 100%;
                height: 100%;
            `;
                const play = document.createElement("img");

                if (this.type == "tijera") {
                    play.src = imgTijera;
                } else if (this.type == "papel") {
                    play.src = imgPapel;
                } else if (this.type == "piedra") {
                    play.src = imgPiedra;
                }
                if (this.opponent == true) {
                    play.classList.add("rotate");
                }
                play.classList.add("play");
                this.shadow.appendChild(style);
                this.shadow.appendChild(play);
            }
        }
    );
}
