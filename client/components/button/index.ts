export function initButton() {
    customElements.define(
        "custom-button",
        class Button extends HTMLElement {
            shadow: ShadowRoot;
            variant: string = "";
            constructor() {
                super();
                this.shadow = this.attachShadow({ mode: "open" });
                this.variant = this.getAttribute("variant") || "";
            }
            connectedCallback() {
                this.render();
            }
            render() {
                const button = document.createElement("button");
                button.textContent = this.textContent;

                const style = document.createElement("style");
                style.innerHTML = `
                .button{
                    background-color: #006CFC;
                    border: 10px solid #001997;
                    box-sizing: border-box;
                    border-radius: 10px;
                    width: 100%;
                    min-width: 300px;
                    max-width: 500px;
                    padding-top: 9px;
                    padding-bottom: 9px;
                    font-family: Odibee Sans;
                    color: #fff;
                    font-size: 45px;
                    font-weight: 400;
                    line-height: 50px;
                }
                .button.exit{
                    background-color: #b40404;
                    border: 10px solid #6b0000;
                }
            `;

                button.classList.add("button");
                if (this.variant == "exit") {
                    button.classList.add("exit");
                }
                this.shadow.appendChild(button);
                this.shadow.appendChild(style);
            }
        }
    );
}
