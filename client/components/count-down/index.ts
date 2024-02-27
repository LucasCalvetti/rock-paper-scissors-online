export function initCountDown() {
    customElements.define(
        "countdown-timer",
        class CountdownTimer extends HTMLElement {
            shadow: ShadowRoot;
            contador: number = 7;
            constructor() {
                super();
                this.shadow = this.attachShadow({ mode: "open" });
                this.contador = JSON.parse(this.textContent);
            }
            connectedCallback() {
                this.render();
            }
            render() {
                const style = document.createElement("style");
                style.innerHTML = `
            .shrink-animation {
                font-family: "Barlow Semi Condensed";
                position: relative;
                top: -195px;
                font-size: 65px;
                color: #000;
                left: 17px;
                -webkit-transition-property: -webkit-transform;
                -webkit-transition-duration: 1s;
                -moz-transition-property: -moz-transform;
                -moz-transition-duration: 1s;
                -webkit-animation-name: shrink;
                -webkit-animation-duration: 2s;
                -webkit-animation-iteration-count: infinite;
                -webkit-animation-timing-function: linear;
                -moz-animation-name: shrink;
                -moz-animation-duration: 2s;
                -moz-animation-iteration-count: infinite;
                -moz-animation-timing-function: linear;
            
                transition-property: -moz-transform;
                transition-duration: 1s;
                animation-name: shrink;
                animation-duration: 1s;
                animation-iteration-count: ${(this.contador + 1).toString()};
                animation-timing-function: ease-in;
            }
            
            @-webkit-keyframes shrink {
                from {
                    -webkit-transform: scale(1);
                }
            
                to {
                    -webkit-transform: scale(4.333);
                }
            }
            
            @-moz-keyframes shrink {
                from {
                    -moz-transform: scale(1);
                }
            
                to {
                    -moz-transform: scale(4.333);
                }
            }
            
            @keyframes shrink {
                from {
                    transform: scale(4.333);
                }
            
                to {
                    transform: scale(0.1);
                }
            }
            
            .spin {
                display: inline-block;
                width: 100%;
                height: 100%;
                border: 15px solid black;
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s ease-in-out ${(this.contador + 1).toString()};
                -webkit-animation: spin 1s ease-in-out infinite;
            }
            @keyframes spin {
                to {
                    -webkit-transform: rotate(360deg);
                }
            }
            @-webkit-keyframes spin {
                to {
                    -webkit-transform: rotate(360deg);
                }
            }
            .time-end{
                display: none;
            }
            
            `;
                const divContainerEl = document.createElement("div");

                divContainerEl.style.display = "block";
                divContainerEl.style.right = "50%";
                divContainerEl.style.height = "243px";
                divContainerEl.style.width = "243px";
                divContainerEl.style.textAlign = "center";

                const divSpinAnimationEl = document.createElement("div");
                divSpinAnimationEl.classList.add("spin");

                const divTimerEl = document.createElement("div");
                divTimerEl.classList.add("shrink-animation");
                divTimerEl.textContent = this.textContent;

                divTimerEl.addEventListener("animationiteration", () => {
                    this.contador--;
                    divTimerEl.textContent = this.contador.toString();
                });
                divTimerEl.addEventListener("animationend", () => {
                    divContainerEl.style.display = "none";
                    divTimerEl.className = "time-end";
                });
                divContainerEl.appendChild(divSpinAnimationEl);
                divContainerEl.appendChild(divTimerEl);
                this.shadow.appendChild(style);
                this.shadow.appendChild(divContainerEl);
            }
        }
    );
}
