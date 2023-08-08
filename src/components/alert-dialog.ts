import { html, css, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import { styles } from '../style_scripts/modified-material-components-web.min.css.js';
import { MDCDialog } from '@material/dialog/component.js';
import { MDCRadio } from '@material/radio/component.js';
import { MDCRipple } from '@material/ripple/component.js';
import { MDCList } from '@material/list/component.js';

export interface AlertDialog extends HTMLElement {
  resultCallback: (result: string) => void;
  openDialog: () => void;
}

export declare var AlertDialog: {
  prototype: AlertDialog;
  new(): AlertDialog;
};

@customElement('alert-dialog') // ts
class AlertDialogImpl extends LitElement implements AlertDialog {

  static styles = [styles,
    css`
      .mdc-list-item {
        align-items: center;
      }
    `
  ]
  
  // Note: can assign a function or object, not just a string or boolean.
  @property({type: Function})
  resultCallback: (result: string) => void | undefined = () => {};

  @property()
  result: any | undefined;

  // @query('.mdc-dialog') // gets a reference to the <dialog> element in the template
  @state() // gets a reference to the <dialog> element in the template
  dialogEl!: HTMLDialogElement;

  @state()
  dialog!: MDCDialog;

  constructor() {
    super();
    this.openDialog = this.openDialog.bind(this);
    this.handleClosing = this.handleClosing.bind(this);
  }

  render() {
    return html`
      <!-- <button id="openDialog" @click=${this.openDialog}>Open Dialog</button> -->
      
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
            <div class="mdc-dialog__content" id="my-dialog-content">
              <ul class="mdc-list">

                <li class="mdc-list-item" tabindex="0">
                  <span class="mdc-list-item__graphic">
                    <div class="mdc-radio">
                      <input class="mdc-radio__native-control"
                            type="radio"
                            id="input-radio-0"
                            name="radio-group"
                            checked>
                      <div class="mdc-radio__background">
                        <div class="mdc-radio__outer-circle"></div>
                        <div class="mdc-radio__inner-circle"></div>
                      </div>
                    </div>
                  </span>
                    <label id="radio-0-label"
                    for="input-radio-0"
                    class="mdc-list-item__text">
                    None
                  </label>
                </li>

                <li class="mdc-list-item" tabindex="1">
                  <span class="mdc-list-item__graphic">
                    <div class="mdc-radio">
                      <input class="mdc-radio__native-control"
                            type="radio"
                            id="input-radio-1"
                            name="radio-group"
                            >
                      <div class="mdc-radio__background">
                        <div class="mdc-radio__outer-circle"></div>
                        <div class="mdc-radio__inner-circle"></div>
                      </div>
                    </div>
                  </span>
                    <label id="radio-1-label"
                    for="input-radio-1"
                    class="mdc-list-item__text">
                    Special
                  </label>
                </li>

                <li class="mdc-list-item" tabindex="2">
                  <div class="mdc-touch-target-wrapper">
                    <div class="mdc-radio mdc-radio--touch">
                      <input class="mdc-radio__native-control" 
                          type="radio" 
                          id="input-radio-2" 
                          name="radio-group" 
                          checked>
                      <div class="mdc-radio__background">
                        <div class="mdc-radio__outer-circle"></div>
                        <div class="mdc-radio__inner-circle"></div>
                      </div>
                      <div class="mdc-radio__ripple"></div>
                    </div>
                  </div>
                    <label id="radio-2-label"
                      for="input-radio-2"
                      class="mdc-list-item__text">
                      Weird Wars
                    </label>
                </li>

                <li class="mdc-list-item" tabindex="3">
                  <div class="mdc-touch-target-wrapper">
                    <div class="mdc-radio mdc-radio--touch">
                      <input class="mdc-radio__native-control" 
                          type="radio" 
                          id="input-radio-3" 
                          name="radio-group" 
                          >
                      <div class="mdc-radio__background">
                        <div class="mdc-radio__outer-circle"></div>
                        <div class="mdc-radio__inner-circle"></div>
                      </div>
                      <div class="mdc-radio__ripple"></div>
                    </div>
                  </div>
                    <label id="radio-3-label"
                      for="input-radio-3"
                      class="mdc-list-item__text">
                      Godzilla
                    </label>
                </li>

              </ul>
            </div>
            <div class="mdc-dialog__actions">
              <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Cancel</span>
              </button>
              <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept">
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

  // componentDidMount() {
  //   this.dialogEl.addEventListener('MDCDialog:closing', this.handleClosing);
  // }

  // componentWillUnmount() {
  //   this.dialogEl.removeEventListener('MDCDialog:closing', this.handleClosing);
  //   this.dialog.destroy();
  // }

  handleClosing() {
    // this.result = this.dialogEl.action;
    this.resultCallback(this.result);
  }

  // add listeners when the element is added to the DOM
  firstUpdated() {
    this.dialogEl = this.shadowRoot?.querySelector('.mdc-dialog') as HTMLDialogElement;
    this.dialog = new MDCDialog(this.dialogEl);
    
    this.dialogEl.addEventListener('MDCDialog:closing', this.handleClosing);
    // this.dialogEl.addEventListener('MDCDialog:closed', this.handleClosed);
    // this.dialogEl.addEventListener('MDCDialog:opened', this.handleOpened);
    // this.dialogEl.addEventListener('MDCDialog:opening', this.handleOpening);

    // this.dialogEl.addEventListener('MDCDialog:accept', this.handleAccept);
    // this.dialogEl.addEventListener('MDCDialog:cancel', this.handleCancel);
    // this.dialogEl.addEventListener('MDCDialog:close', this.handleClose);

    // Add interactivity to the MDC Radio Buttons
    const radioButtons = this.shadowRoot?.querySelectorAll('.mdc-radio') as NodeListOf<HTMLButtonElement>;
    radioButtons.forEach((button) => {
      new MDCRadio(button)
    });

    this.dialog.listen('MDCDialog:opened', () => {
      this.dialog.layout();
    });

    const lists = this.shadowRoot?.querySelectorAll('.mdc-list') as NodeListOf<HTMLButtonElement>;
    lists.forEach((list) => {
      // add ripple to list items
      (list as any).listElements.map((listItemEl: Element) => {
        new MDCRipple(listItemEl);
      });

      new MDCList(list)
    });



    // this.dialog.addEventListener('close', (e) => {
    //   this.result = this.dialog.returnValue
    //   this?.resultCallback(this.result)
    // })

    // // Click outside dialog closes it
    // this.dialog.addEventListener('click', e => {
    //   if((e as PointerEvent).pointerId === -1) return; // ignore keyboard-sourced `clicks`

    //   var rect = this.dialog.getBoundingClientRect();
    //   var isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
    //     rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      
    //   if (!isInDialog) {
    //     this.dialog.close();
    //   }
    // })

    // // Listen for "enter" key
    // this.dialog.addEventListener('keydown', (e) => {
    //   if (e.key === "Enter") {
    //     this.dialog.returnValue = "btn_confirm"
    //     this.dialog.close();
    //   }
    // })
  }

  openDialog() {
    this.dialog.open()
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
