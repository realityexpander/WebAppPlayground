import { LitElement, html } from 'lit';
import { styles } from './modified-material-components-web.min.css.js';

// import windowBroadcastChannel from 'index.html';

class BroadcastMessage extends LitElement {

  #channel;

  static styles = styles;
  static get localStyles() {
    return `
    * {
      box-sizing: border-box;
      font-family: inherit;
      font-weight: inherit;
    }
    html {
      font-size: 20px;
      font-family: sans-serif;
      font-weight: 300;
    }
    input {
      width: 40ch;
    }
  `;
  }

  constructor() {
    super();
    this.#channel = new BroadcastChannel('wkrp');
  }

  firstUpdated() {
    let btnOpen = this.shadowRoot.getElementById('btnOpen');
    btnOpen.addEventListener('click', this.onOpenTab.bind(this));

    let btnSend = this.shadowRoot.getElementById('btnSend');
    btnSend.addEventListener('click', this.onSendMessage.bind(this));

    // Setup the listener for the BroadcastChannel messages
    this.#channel.addEventListener('message', this.onReceiveMessage.bind(this));
  }

  render() {
    // If provided, the properties for type and day are taking from the path.
    return html`
    <style>
      ${this.localStyles}
    </style>
    <div class="wrapper">
      <h1>Send & Receive Broadcast Messages</h1>
      <br><br>

      <section class="actions">
        <button id="btnOpen">Open a New Tab</button><br />
        <input type="text" id="txtMessage" />
        <button id="btnSend">Send Message</button>
      </section>
      <!-- messages go here -->
      <section id="messages"></section>
    </div>
      `
  }

  onOpenTab() {
    let protocol = window.location.protocol;
    let host = window.location.host;

    window.open(`${protocol}//${host}/broadcast.html`); // makes sure to match the current domain
    // window.open('/broadcast.html'); // opens to possibly a different domain
  }

  onSendMessage() {
    let txtMessage = this.shadowRoot.getElementById('txtMessage');
    if (!txtMessage.value) return;

    this.#channel.postMessage({ message: txtMessage.value });
  }

  onReceiveMessage(event) {
    if (!event) return;
    if (!event.data) return;

    let messages = this.shadowRoot.getElementById('messages');
    let message = document.createElement('div');
    message.textContent = event.data.message;
    messages.appendChild(message);
  }

}
customElements.define('page-broadcast-message', BroadcastMessage);