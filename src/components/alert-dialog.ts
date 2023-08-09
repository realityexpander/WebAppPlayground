import { html, css, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import { styles } from '../style_scripts/modified-material-components-web.min.css.js';
import { MDCDialog } from '@material/dialog/component.js';
import { MDCRadio } from '@material/radio/component.js';
import { MDCRipple } from '@material/ripple/component.js';
import { MDCList } from '@material/list/component.js';
import { MDCFormField } from '@material/form-field/component.js';
import { ContextProviderEvent } from '@lit-labs/context/lib/controllers/context-provider.js';

export interface AlertDialog extends HTMLElement {
  resultCallback: (result: AlertDialogResult) => void;
  openDialog: () => void;
}

export declare var AlertDialog: {
  prototype: AlertDialog;
  new(): AlertDialog;
};

export interface AlertDialogResult {
  action: string,
  selection: [number, string, string] | null
}

@customElement('alert-dialog') // ts
class AlertDialogImpl extends LitElement implements AlertDialog {

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
    `
  ]
  
  // Note: can assign a function or object, not just a string or boolean.
  @property({type: Function})
  resultCallback: (result: AlertDialogResult) => void = () => {};

  @property()
  //result: [number, string, string] | undefined;
  result: AlertDialogResult | undefined;
  

  @state()
  private _selection: [number, string, string] = [-1, '', '']; // index, id, innerHTML of selected radio button

  // @query('.mdc-dialog') // gets a reference to the <dialog> element in the template
  @state() // gets a reference to the <dialog> element in the template
  private _dialogEl!: HTMLDialogElement;

  @state()
  private _dialog!: MDCDialog;

  openDialog() {
    this._dialog.open()
  }

  render() {
    return html`
      <!--
      <div class="mdc-dialog"
        role='alertdialog'
        aria-modal='true'
        aria-describedby='alert-dialog-description'>
        <div class='mdc-dialog__scrim'></div>
        <div class='mdc-dialog__container'>
          <div class='mdc-dialog__surface'>
            <section id='alert-dialog-description' class='mdc-dialog__content'>
              <p>Discard draft?</p>
            </section>
            <footer className='mdc-dialog__actions'>
              <button type='button' className='mdc-button mdc-dialog__button' data-mdc-dialog-action='close'>Cancel</button>
              <button type='button' className='mdc-button mdc-dialog__button' data-mdc-dialog-action='accept'>Discard</button>
            </footer>
          </div>
        </div>
      </div>
      -->

      <!--
      <div class="mdc-dialog">
        <div class="mdc-dialog__container">
          <div class="mdc-dialog__surface"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="my-dialog-title"
            aria-describedby="my-dialog-content">
            <div class="mdc-dialog__content" id="my-dialog-content">
              Discard draft?
            </div>
            <div class="mdc-dialog__actions">
              <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Cancel</span>
              </button>
              <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="discard">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Discard</span>
              </button>
            </div>
          </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>
      -->

      <!--
      <div class="mdc-dialog">
        <div class="mdc-dialog__container">
          <div class="mdc-dialog__surface"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="my-dialog-title"
            aria-describedby="my-dialog-content">
            <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -x->
            <h2 class="mdc-dialog__title" id="my-dialog-title">
              Choose a Ringtone
            </h2>
            <div class="mdc-dialog__content" id="my-dialog-content">
              <ul class="mdc-list mdc-list--avatar-list">
                <li class="mdc-list-item" tabindex="0" data-mdc-dialog-action="none">
                  <span class="mdc-list-item__text">None</span>
                </li>
                <li class="mdc-list-item" data-mdc-dialog-action="callisto">
                  <span class="mdc-list-item__text">Callisto</span>
                </li>
                <!-- ... -x->
              </ul>
            </div>
          </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>
      -->

      
      <div class="mdc-dialog">
        <div class="mdc-dialog__container">
          <div class="mdc-dialog__surface"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="my-dialog-title"
            aria-describedby="my-dialog-content">
            <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
            <h2 class="mdc-dialog__title" id="my-dialog-title">
              Choose a Ringtone
            </h2>
            <div class="mdc-dialog__content" id="my-dialog-content" >
              <div class="mdc-form-field mdc-form-field--nowrap">

                  <div class="mdc-touch-target-wrapper data-mdc-dialog-initial-focus">
                    <div class="mdc-radio mdc-radio--touch">
                      <input class="mdc-radio__native-control"
                            type="radio"
                            id="input-radio-0"
                            name="radio-group"
                            checked> <!-- Note: Always default to the first item -->
                      <div class="mdc-radio__background">
                        <div class="mdc-radio__outer-circle"></div>
                        <div class="mdc-radio__inner-circle"></div>
                      </div>
                      <div class="mdc-radio__ripple"></div>
                    </div>
                    <label id="label-radio-0"
                      for="input-radio-0"
                      class="mdc-list-item__text">
                        None
                    </label>
                  </div>

                  <div class="mdc-touch-target-wrapper">
                    <div class="mdc-radio mdc-radio--touch">
                      <input class="mdc-radio__native-control"
                            type="radio"
                            id="input-radio-1"
                            name="radio-group">
                      <div class="mdc-radio__background">
                        <div class="mdc-radio__outer-circle"></div>
                        <div class="mdc-radio__inner-circle"></div>
                      </div>
                      <div class="mdc-radio__ripple"></div>
                    </div>
                    <label id="label-radio-1"
                      for="input-radio-1"
                      class="mdc-list-item__text">
                        Special
                    </label>
                  </div>

                  <div class="mdc-touch-target-wrapper">
                    <div class="mdc-radio mdc-radio--touch">
                      <input class="mdc-radio__native-control" 
                          type="radio" 
                          id="input-radio-2" 
                          name="radio-group">
                      <div class="mdc-radio__background">
                        <div class="mdc-radio__outer-circle"></div>
                        <div class="mdc-radio__inner-circle"></div>
                      </div>
                      <div class="mdc-radio__ripple"></div>
                    </div>
                    <label id="label-radio-2"
                      for="input-radio-2"
                      class="mdc-list-item__text">
                        Weird Wars
                    </label>
                  </div>

              </div>
            </div>
            <div class="mdc-dialog__actions">
              <button type="button" 
                  class="mdc-button mdc-dialog__button" 
                  data-mdc-dialog-action="close"
                >
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Cancel</span>
              </button>
              <button type="button" 
                  class="mdc-button mdc-dialog__button" 
                  data-mdc-dialog-action="accept" 
                  data-mdc-dialog-button-default
                >
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">OK</span>
              </button>
            </div>
          </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>
      

      <!--
      <div class="mdc-dialog mdc-dialog mdc-dialog--fullscreen">
        <div class="mdc-dialog__container">
          <div class="mdc-dialog__surface"
            role="dialog"
            aria-modal="true"
            aria-labelledby="my-dialog-title"
            aria-describedby="my-dialog-content">
            <div class="mdc-dialog__header">
              <h2 class="mdc-dialog__title" id="my-dialog-title">
                Full-Screen Dialog Title
              </h2>
              <button class="mdc-icon-button material-icons mdc-dialog__close"
                      data-mdc-dialog-action="close">
                close
              </button>
            </div>
            <div class="mdc-dialog__content" id="my-dialog-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed scelerisque metus dapibus, maximus massa pulvinar, commodo nunc.
              Quisque vitae luctus lectus, ut tempus ipsum. Sed suscipit gravida scelerisque.
              Aenean vulputate elementum est, quis consectetur orci consectetur ac.
              Quisque accumsan vel nisi id dapibus. Suspendisse nec urna eu massa ornare rutrum.
              Vivamus at nisi sit amet nulla pretium volutpat sit amet in justo. Donec mi metus,
              interdum ac tincidunt at, vehicula vitae nisl. Morbi fermentum dapibus massa,
              nec lobortis massa vestibulum eu.
            </div>
            <div class="mdc-dialog__actions">
              <button type="button" class="mdc-button mdc-dialog__button"
                      data-mdc-dialog-action="ok">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">OK</span>
              </button>
            </div>
          </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>
      -->
    `
  }

  private _handleClosed = (evt: Event) => {
    const action = (evt as CustomEvent).detail.action
    this.result = {
      action: (evt as CustomEvent).detail.action,
      selection: action=="accept" ? this._selection : null
    }
    this.resultCallback(this.result)
  }

  private _handleOpening = (evt: Event) => {
    const radioButtons = this.shadowRoot?.querySelectorAll('.mdc-radio') as NodeListOf<HTMLButtonElement>

    // select the first radio button as defaul
    radioButtons.item(0).querySelector('input')?.click()    
  }

  private _getRadioButtonInfo(index: number): [number, string, string] {
    const radioButtons = this.shadowRoot?.querySelectorAll('.mdc-radio') as NodeListOf<HTMLButtonElement>
    const button = radioButtons.item(index)
    const buttonId = button.querySelector('input')?.id ?? ''
    const buttonLabel = (button?.nextSibling?.nextSibling as HTMLLabelElement)?.innerText.trim()

    return [index, buttonId, buttonLabel]
  }

  firstUpdated() {
    this._dialogEl = this.shadowRoot?.querySelector('.mdc-dialog') as HTMLDialogElement
    this._dialog = new MDCDialog(this._dialogEl);
    
    // Add interactivity to the MDC Radio Buttons
    const radioButtons = this.shadowRoot?.querySelectorAll('.mdc-radio') as NodeListOf<HTMLButtonElement>
    radioButtons.forEach((button, index) => {
      const radio = new MDCRadio(button)
      radio.listen('change', () => {
        this._selection = this._getRadioButtonInfo(index)
      })

      new MDCRadio(button)
    })

    // Set default selection
    this._selection = this._getRadioButtonInfo(0)
    radioButtons.item(0).querySelector('input')?.setAttribute('checked', 'true')

    // Add interactivity to the MDC Form Field
    const formFields = this.shadowRoot?.querySelectorAll('.mdc-form-field') as NodeListOf<HTMLDivElement>
    formFields.forEach((formField) => {
      new MDCFormField(formField);
    })

    const lists = this.shadowRoot?.querySelectorAll('.mdc-list') as NodeListOf<HTMLUListElement>
    lists.forEach((list: HTMLUListElement) => {
      // add ripple to list items
      (list as any).listElements?.map((listItemEl: Element) => {
        new MDCRipple(listItemEl);
      })

      new MDCList(list)
    })

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
        this._dialog.close();
      }
    })
  }

}
