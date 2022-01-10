export function initText() {
    class CustomText extends HTMLElement {
        shadow: ShadowRoot;
        tags: string[] = ["h1", "h2", "p", "span"];
        tag: string = "p";
        size = "";
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: "open" });
            if (this.tags.includes(this.getAttribute("tag"))) {
                this.tag = this.getAttribute("tag") || this.tag;
            }
        }
        connectedCallback() {
            this.render();
        }
        render() {
            const rootEl = document.createElement(this.tag);
            rootEl.textContent = this.textContent;
            const style = document.createElement("style");
            const tagSelected = this.tag;
            const styleSelector = {
                h1: "main-title",
                h2: "secondary-title",
                p: "paragraph",
                span: "body",
            };
            const size = this.getAttribute("size");
            /* 
        main-title = texto de titulo de welcome
        paragraph = textos largos como por ej, instructions
        secondary-title = texto de result, y titulo de score
        body = texto base de score
        */
            style.innerHTML = `
        .main-title{
            font-size: ${size || "90px"};
            font-family: "Barlow Semi Condensed";
            margin: 0;
            display: inherit;
            color: inherit;
            line-height: 88.1%;
        }
        .secondary-title{
            text-align: center;
            font-family: Odibee Sans;
            font-size: font-size: ${size || "55px"};
            font-weight: normal;
            margin: 0;
            color: inherit;
        }
        .paragraph{
            font-family: "Barlow Semi Condensed";
            font-style: normal;
            font-weight: 600;
            font-size: ${size || "45px"};
            text-align: center;
            line-height: 95%;
            margin: 0;
        }
        .body{
            font-family: Odibee Sans;
            font-style: normal;
            font-weight: normal;
            font-size: ${size || "45px"};
            line-height: 50px;
            display: block;
        }
        `;
            rootEl.className = styleSelector[tagSelected];
            this.shadow.appendChild(style);
            this.shadow.appendChild(rootEl);
        }
    }
    customElements.define("custom-text", CustomText);
}
