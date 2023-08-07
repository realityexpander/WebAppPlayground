// import { html, css, LitElement, PropertyValueMap } from 'lit';
import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { styles } from '../style_scripts/modified-material-components-web.min.css.js';

@customElement('simple-dialog') // ts
class SimpleDialog extends LitElement {

  static styles = [styles,
    css`
      dialog {
        width: 400px;
        height: 300px;
        background-color: #ecececFF;
        border: 1px solid black;
      }
    `];
  
  @property()
  result: string | undefined;

  render() {
    return html`
      <button id="openDialog" @click=${this.openDialog}>Open Dialog</button>
      <dialog id="dialog">
        <h1>Dialog</h1>
        <p>Dialog content</p>
        <button id="closeDialog" @click=${this.closeDialog}>Close Dialog</button>
        <form method="dialog">
          <input type="submit" value="Dismiss">
        </form>
        <button id="confirmSelection" @click=${this.confirmDialog}>Confirm</button>
      </dialog>
    `;
  }

  openDialog() {
    const dialog = this.shadowRoot?.getElementById("dialog") as HTMLDialogElement
    dialog.showModal()

    // // capture click on backdrop
    dialog.addEventListener('click', (e) => {
      var rect = dialog.getBoundingClientRect();
      var isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        dialog.close();
      }
    })
  }

  closeDialog() {
    const dialog = this.shadowRoot?.getElementById("dialog") as HTMLDialogElement
    dialog.close()
    this.result = "dismissed"
  }

  confirmDialog() {
    const dialog = this.shadowRoot?.getElementById("dialog") as HTMLDialogElement
    dialog.close()
    this.result = "confirmed"
  }
}