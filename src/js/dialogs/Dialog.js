/**
 * @file Dialog.js
 * @description Class definition for the GWA dialog web component.
 * @author Jared Dantis (@jareddantis)
 * @license GPLv2
 */

class Dialog extends HTMLElement {
    /**
     * Constructor for the dialog instance.
     * Attaches the shadow root and appends the dialog to a designated
     * animatable DIV.
     */
    constructor() {
        super();
        this.listeners = {};
        this.attachShadow({ mode: "open" });

        // Isolate dialog in separate container to ensure smooth animation
        this.container = document.getElementById('dialog-container');
        this.container.appendChild(this);
    }

    /**
     * Called upon appending to DOM.
     * Applies specified template to the shadow DOM and propagates
     * user-specified theme to the dialog.
     */
    connectedCallback() {
        const { shadowRoot } = this;
        const template = document.getElementById('dialog-template');
        const node = document.importNode(template.content, true);
        shadowRoot.appendChild(node);

        // Copy theme
        const root = shadowRoot.querySelector('.dialog-content');
        let accent = state.get("set"),
            theme = document.documentElement.getAttribute('data-theme');
        root.setAttribute('data-theme', theme);
        root.setAttribute('data-accent', accent);

        // Attach transition end listener
        this.addEventListener('transitionend', this.onTransitionFinished);

        // Attach click listener
        this.addEventListener('click', Dialog.onClickListener);
    }

    /**
     * Called upon detachment from the DOM.
     * Detaches all button listeners.
     */
    disconnectedCallback() {
        let buttons = this.shadowRoot.querySelectorAll('.dialog-buttons li');
        for (let i = 0; i < buttons.length; i++) {
            let button = buttons[i];
            button.removeEventListener('click', this.listeners[button.innerText]);
        }

        // Detach transition end listener
        this.removeEventListener('transitionend', this.onTransitionFinished);

        // Detach click listener
        this.removeEventListener('click', Dialog.onClickListener);
    }

    /**
     * Dialog header/title.
     *
     * @param {String} text - Dialog title
     */
    set title(text) {
        const { shadowRoot } = this;
        shadowRoot.querySelector('.dialog-header h2').innerHTML = text;
    }

    /**
     * Dialog type. Useful for setting custom styles per dialog - see /src/less/dialogs.
     * Will be set as the 'type' attribute on the root '.dialog-content' element.
     *
     * @param {String} text - Dialog type
     */
    set type(text) {
        const { shadowRoot } = this;
        this.setAttribute('type', text);
        shadowRoot.querySelector('.dialog-content').setAttribute('type', text);
    }

    /**
     * Add button to dialog.
     *
     * @param {String} text - Button label
     * @param {Function} listener - Button click listener
     */
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

    /**
     * Appends specified HTML element to the dialog body.
     *
     * @param {HTMLElement} el - Element to be appended
     */
    appendToBody(el) {
        const { shadowRoot } = this;
        shadowRoot.querySelector('.dialog-body').appendChild(el);
    }

    /**
     * Shows dialog
     */
    show() {
        // Sometimes the animation does not play due to reflows.
        // Let's use a small delay to allow the browser some breathing time.
        const { container } = this;
        window.setTimeout(function(){
            requestAnimationFrame(function(){
                container.classList.add('animating');
                container.classList.add('visible');
            });
        }, 10);
    }

    /**
     * Dismisses dialog and removes root <gwa-dialog> element from the light DOM.
     */
    dismiss() {
        const { container } = this;
        container.classList.add('animating');
        container.classList.remove('visible');

        // Remove after animation
        window.setTimeout(function() {
            container.classList.remove('animating');
            container.removeChild(this);
        }.bind(this), 300);
    }

    /**
     * Listener for removing 'animating' class after animation
     */
    onTransitionFinished() {
        this.container.classList.remove('animating');
    }

    /**
     * Listener for preventing event propagation to ancestors
     *
     * @param {Event} event - Click event
     */
    static onClickListener(event) {
        event.stopPropagation();
    }
}

customElements.define('gwa-dialog', Dialog);