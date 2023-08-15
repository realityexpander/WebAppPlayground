import { LitElement, html, css } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';
import { customElement, property, query, state } from 'lit/decorators.js';

import './components/slot-dialog.js'
import { SlotDialog } from './components/slot-dialog.js';

import './components/share-dialog.js'
import { ShareDialog } from './components/share-dialog.js';

@customElement('page-slot-dialog')  // ts
class PageSlotDialog extends LitElement {

  static styles = [
    styles,
  ];

  @query("slot-dialog")
  slotDialog!: HTMLElement

  @query("share-dialog")
  shareDialog!: HTMLElement

  constructor() {
    super();

  }

  firstUpdated() {
    
  }

  render() {
    return html`

      <div class="wrapper">
        
        <h1>This is the page for slot-dialog</h1>
        <br>
        <button @click="${() => (this.slotDialog as SlotDialog).openDialog()}">Open Slot Dialog</button>

        <slot-dialog title="Dialog Title">
        <!-- <slot-dialog> -->
          <p>This is content from the parent element</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </slot-dialog>
        <br>
        <br>

        <h2>Share Dialog</h2>
        <button @click="${() => (this.shareDialog as ShareDialog).openDialog()}">Open Share Dialog</button>
        <share-dialog 
          title="Share Title"
          description="This is the description of the share item"
          url="https://www.google.com"
          >
        </share-dialog>

      </div>
    `
  }

}


