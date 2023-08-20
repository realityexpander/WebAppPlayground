import { LitElement, html, css } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';
import { customElement, property, query, state } from 'lit/decorators.js';

import './components/slot-dialog.js'
import { SlotDialog, SlotDialogResult } from './components/slot-dialog.js';

import './components/share-dialog.js'
import { ShareDialog, ShareDialogResult } from './components/share-dialog.js';

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

  async redisSetKey(key: string, value: string) {
    let result = await fetch(`redis/set?key=${key}&value=${value}`)
    return await result.text()
  }

  async redisGetKey(key: string) {
    let result = await fetch(`redis/get?key=${key}`)
    return await result.text()
  }

  async redisGetKeys() {
    let result = await fetch("redis/keys")
    return await result.text()
  }

  async redisJsonGetKeys(key: string) {
    let result = await fetch(`redis/jsonGet?key=${key}`)
    return await result.json()
  }

  async redisJsonSetKeys(key: string, value: string) {
    let result = await fetch(`redis/jsonSet?key=${key}&value=${value}`)
    return await result.text()
  }

  firstUpdated() {
    (this.slotDialog as SlotDialog).resultCallback = (result: SlotDialogResult) => {
      this.shadowRoot!.getElementById("slot-dialog-result")!.innerHTML = JSON.stringify(result);
    }

    (this.shareDialog as ShareDialog).resultCallback = (result: ShareDialogResult) => {
      this.shadowRoot!.getElementById("share-dialog-result")!.innerHTML = JSON.stringify(result);
    }
  }

  render() {
    return html`

      <div class="wrapper">
        
        <h1>This is the page for Slot Dialog & Share Dialog</h1>
        <br>
        <br>

        <h2>Redis</h2>
        <button @click="${() => {
          this.redisSetKey("key1", "data2").then((result) => {
            this.shadowRoot!.getElementById("redis-result")!.innerHTML = result ?? "null";
          }) 
        }}">Redis Set Key</button>
        <br>
        <button @click="${() => {
          this.redisGetKey("key1").then((result) => {
            this.shadowRoot!.getElementById("redis-result")!.innerHTML = result ?? "null";
          }) 
        }}">Redis Get Key</button>  
        <br>
        <button @click="${() => {
          this.redisGetKeys().then((result) => {
            this.shadowRoot!.getElementById("redis-result")!.innerHTML = result ?? "null";
          }) 
        }}">Redis Keys</button>  
        <p id="redis-result"></p>
        <br>
        <p id="redis-result"></p>
        <br>
        <br>

        <!-- redis json -->
        <button @click="${() => {
          this.redisJsonGetKeys(".").then((result) => {
            let result2 = JSON.stringify(JSON.parse(result.value), null, 2)
            this.shadowRoot!.getElementById("redis-json-result")!.innerHTML = `<code>${result2}</code>` ?? "null";
          }) 
        }}">Redis Json Get Key</button>  
        <br>
        <button @click="${() => {
          this.redisJsonSetKeys(".newjson", JSON.stringify({a:100, b:"your mom", e: "fuck"})).then((result) => {
            this.shadowRoot!.getElementById("redis-json-result")!.innerHTML = result ?? "null";
          })
        }}">Redis Json Set Key</button>
        <br>

        <pre id="redis-json-result"></pre>
        <br>



        <h2>Slot Dialog</h2>
        <button @click="${() => (this.slotDialog as SlotDialog).openDialog()}">Open Slot Dialog</button>
        <p>Slot dialog result:</p>
        <p id="slot-dialog-result"></p>

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
        <p>Share dialog result:</p>
        <p id="share-dialog-result"></p>

        <share-dialog 
          title="Share this link: https://www.google.com"
          description="This is the description of the share item"
          url="https://www.google.com"
          >
        </share-dialog>
        
      </div>
      `
  }

}


