// import { html, css, LitElement, PropertyValueMap } from 'lit';
import { html, css, LitElement, PropertyValueMap } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import { styles } from '../style_scripts/modified-material-components-web.min.css.js';

export interface SimpleDialog extends HTMLElement {
  resultCallback: (result: string) => void;
}

export declare var SimpleDialog: {
  prototype: SimpleDialog;
  new(): SimpleDialog;
};

@customElement('simple-dialog') // ts
class SimpleDialogImpl extends LitElement implements SimpleDialog {

  static styles = [styles,
    css`
      dialog {
        width: 400px;
        height: 300px;
        background-color: #ecececFF;
        border: 1px solid black;
      }
      ::backdrop {
        background-color: #00000080;
      }
    `];
  
  // Note: can assign a function or object, not just a string or boolean.
  @property({type: Function})
  resultCallback: (result: string) => void | undefined = () => {};

  @property()
  result: string | undefined;

  @query('dialog') // gets a reference to the <dialog> element in the template
  dialog!: HTMLDialogElement;

  render() {
    return html`
      <button id="openDialog" @click=${this.openDialog}>Open Dialog</button>
      <!--
      <dialog id="dialog">
        <h1>Dialog</h1>
        <p>Dialog content</p>
        <button id="cancelDialog" @click=${this.cancelDialog}>Close Dialog</button>
        <button id="confirmSelection" @click=${this.confirmDialog}>Confirm</button>
        <form method="dialog"> <!-- this closes the nearest dialog without js! -x->
          <input type="submit" value="Dismiss">
        </form>
      </dialog>
      -->

      <dialog id="dialog">
        <h1>Dialog</h1>
        <p>Dialog content</p>
        <form method="dialog"> <!-- this closes the nearest dialog & deals with clicks without js! -->
          <button type="submit" value="btn_confirm">Confirm</button>
          <button type="submit" value="btn_cancel">Cancel</button>
        </form>
      </dialog>
    `;
  }

  // add listeners when the element is added to the DOM
  firstUpdated() {
    this.dialog.addEventListener('close', (e) => {
      this.result = this.dialog.returnValue
      this?.resultCallback(this.result)
    })

    // Click outside dialog closes it
    this.dialog.addEventListener('click', e => {
      if((e as PointerEvent).pointerId === -1) return; // ignore keyboard-sourced `clicks`

      var rect = this.dialog.getBoundingClientRect();
      var isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      
      if (!isInDialog) {
        this.dialog.close();
      }
    })

    // Listen for "enter" key
    this.dialog.addEventListener('keydown', (e) => {
      if (e.key === "Enter") {
        this.dialog.returnValue = "btn_confirm"
        this.dialog.close();
      }
    })
  }

  openDialog() {
    this.dialog.returnValue = "btn_cancel"  // reset to default
    this.dialog.showModal()
  }

  cancelDialog() {
    this.dialog.close()
    this.result = "btn_cancel"
    this?.resultCallback(this.result)
  }

  confirmDialog() {
    this.dialog.close()
    this.result = "btn_confirm"
    this?.resultCallback(this.result)
  }
}