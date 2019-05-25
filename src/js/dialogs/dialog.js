class Dialog extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        const { shadowRoot } = this;
        const template = document.getElementById('dialog-template');
        const node = document.importNode(template.content, true);
        shadowRoot.appendChild(node);
    }

    set title(text) {
        const { shadowRoot } = this;
        shadowRoot.querySelector('.dialog-header h2').innerText = text;
    }

    set type(text) {
        const { shadowRoot } = this;
        this.setAttribute('type', text);
        shadowRoot.querySelector('.dialog-content').setAttribute('type', text);
    }

    addButton(text, listener) {
        const { shadowRoot } = this;

        // Create <li>
        let el = document.createElement('li');
        el.innerText = text;
        el.addEventListener('click', listener.bind(this));

        // Append <li> to DOM
        shadowRoot.querySelector('.dialog-buttons ul').appendChild(el);
    }

    appendToBody(el) {
        const { shadowRoot } = this;
        shadowRoot.querySelector('.dialog-body').appendChild(el);
    }

    show() {
        app.dim();
        this.classList.add('visible');
    }

    dismiss() {
        app.unDim();
        this.classList.remove('visible');
    }
}

customElements.define('gwa-dialog', Dialog);