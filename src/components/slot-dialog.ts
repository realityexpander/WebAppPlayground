import { html, css, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import { styles } from '../style_scripts/modified-material-components-web.min.css.js';
import { MDCDialog } from '@material/dialog/component.js';
import { MDCRadio } from '@material/radio/component.js';
import { MDCRipple } from '@material/ripple/component.js';
import { MDCList } from '@material/list/component.js';
import { MDCFormField } from '@material/form-field/component.js';
import { ContextProviderEvent } from '@lit-labs/context/lib/controllers/context-provider.js';

export interface SlotDialog extends HTMLElement {
  resultCallback: (result: SlotDialogResult) => void;
  openDialog: () => void;
}

export declare var SlotDialog: {
  prototype: SlotDialog;
  new(): SlotDialog;
};

export interface SlotDialogResult {
  action: string,
  // selection: [number, string, string] | null
}


// https://web.dev/building-a-dialog-component/
@customElement('slot-dialog') // ts
class SlotDialogImpl extends LitElement implements SlotDialog {

  static styles = [styles,
    css`
      .mdc-list-item {
        align-items: center;
      }

      .mdc-form-field {
        display:flex; 
        flex-direction: column; 
        align-items: flex-start;
      }

      .mdc-touch-target-wrapper {
        display: inline-flex;
        align-items: center;
      }

      .mdc-dialog__title {
        padding-left: 17px;
      }
    `
  ]

  @property({type: String})
  title: string = "";

  @property({type: String})
  cancelButtonText: string = "Cancel";

  @property({type: String})
  confirmButtonText: string = "OK";

  
  // Note: can assign a function or object, not just a string or boolean.
  @property({type: Function})
  resultCallback: (result: SlotDialogResult) => void = () => {};

  @property()
  //result: [number, string, string] | undefined;
  result: SlotDialogResult | undefined;
  

  @query('.mdc-dialog') // gets a reference to the <dialog> element in the template
  // @state() // gets a reference to the <dialog> element in the template
  private _dialogEl!: HTMLDialogElement;

  @state()
  private _dialog!: MDCDialog;

  openDialog() {
    this._dialog.open()
  }

  render() {
    return html`
      <div class="mdc-dialog">
        <div class="mdc-dialog__container">
          <div class="mdc-dialog__surface"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="my-dialog-title"
            aria-describedby="my-dialog-content">
            <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
              ${ this.title 
                ? html`
                  <h2 class="mdc-dialog__title" id="my-dialog-title">
                    ${this.title}
                  </h2>
                  ` 
                : html``}
            <div class="mdc-dialog__content" id="my-dialog-content">
                <slot></slot>
            </div>
            <div class="mdc-dialog__actions">
              <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">${this.cancelButtonText}</span>
              </button>
              <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="confirm">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">${this.confirmButtonText}</span>
              </button>
            </div>
          </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>
    `
  }

  private _handleClosed = (evt: Event) => {
    const action = (evt as CustomEvent).detail.action
    this.result = {
      action: (evt as CustomEvent).detail.action,
      // selection: action=="accept" ? this._selection : null
    }
    this?.resultCallback(this.result)
  }

  private _handleOpening = (evt: Event) => {
    // Do opening dialog initialization here
  }

  firstUpdated() {
    // this._dialogEl = this.shadowRoot?.querySelector('.mdc-dialog') as HTMLDialogElement
    this._dialog = new MDCDialog(this._dialogEl);
    
    // this._dialogEl.addEventListener('MDCDialog:closing', this.handleClosing)
    this._dialogEl.addEventListener('MDCDialog:closed', this._handleClosed)
    // this._dialogEl.addEventListener('MDCDialog:opened', this.handleOpened)
    this._dialogEl.addEventListener('MDCDialog:opening', this._handleOpening)
    
    this._dialog.listen('MDCDialog:opened', () => {
      this._dialog.layout();
    })


    // Listen for "enter" key
    this._dialogEl.addEventListener('keydown', (e) => {
      if (e.key === "Enter") {
        (this._dialogEl.querySelector('[data-mdc-dialog-action="confirm"]') as HTMLElement)?.click()
      }
      if (e.key === "Escape") {
        (this._dialogEl.querySelector('[data-mdc-dialog-action="cancel"]') as HTMLElement)?.click()
        // this._dialog.close();
      }
    })
  }

}
