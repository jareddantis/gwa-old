class Dialog extends HTMLElement {
    constructor() {
        super();
        this.listeners = {};
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        const { shadowRoot } = this;
        const template = document.getElementById('dialog-template');
        const node = document.importNode(template.content, true);
        shadowRoot.appendChild(node);
    }

    disconnectedCallback() {
        // Remove all button listeners
        let buttons = this.shadowRoot.querySelectorAll('.dialog-buttons li');
        for (let i = 0; i < buttons.length; i++) {
            let button = buttons[i];
            button.removeEventListener('click', this.listeners[button.innerText]);
        }
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
        let boundListener = listener.bind(this);
        let el = document.createElement('li');
        el.innerText = text;
        el.addEventListener('click', boundListener);

        // Store button & function reference for cleanup on disconnect
        this.listeners[text] = boundListener;

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