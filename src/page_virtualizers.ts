import { LitElement, html, css } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';
import { customElement, property, query, state } from 'lit/decorators.js';

import { LitVirtualizer } from '@lit-labs/virtualizer';
import { virtualize, virtualizerRef } from '@lit-labs/virtualizer/virtualize.js';
import { flow } from '@lit-labs/virtualizer/layouts/flow.js';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';
import { masonry } from '@lit-labs/virtualizer/layouts/masonry.js';
import { repeat } from 'lit/directives/repeat.js';

// Simple Dialog
import './components/simple-dialog.js';
import { SimpleDialog } from './components/simple-dialog.js';
import './components/import-virtualizer.js';

// MDC Alert Dialog
import './components/alert-dialog.js';
import { AlertDialog, AlertDialogResult } from './components/alert-dialog.js';

// Controllers
import {ClockController} from './components/clock-controller.js';
import {NamesController} from './components/names-controller.js';
import * as Names from './components/names-api.js';

@customElement('page-virtualizers')  // ts
class PageVirtualizers extends LitElement {

  static styles = [styles,
    css`
      :host {
        display: block;
        padding: 10px;
      }
      /*
      .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      */
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        /* width: 100%; */
        max-width: 600px;
      }
      li {
        padding: 10px;
        border-bottom: 1px solid #ccc;
      }
      li:nth-child(even) {
        background-color: #eee;
      }
      li:hover {
        background-color: #ddd;
      }
    `];

  // Create the clock controller and store it
  private _clock = new ClockController(this, 100);
  private _timeFormat = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: 'numeric', second: 'numeric',
  });

  // Create the names controller and store it
  private names = new NamesController(this);
  

  @query('ul')  // gets a reference to the <ul> element in the template
  list: HTMLUListElement | undefined;
  data: {text: string}[] = new Array(100).fill('').map((i, n) => ({text: `Item ${n}`}));

  @state()
  simpleDialogResult: string | undefined;

  // @query('alert-dialog')
  @state()
  alertDialogEl: HTMLElement | undefined;

  @state()
  alertDialog: AlertDialog | undefined;

  @state()
  alertDialogResult: AlertDialogResult | undefined;

  firstUpdated() {
    // setup the dialog result callback
    // note: assigning a function to an attribute is ok. Also can assign an object, not just a string or boolean.
    (this.shadowRoot?.querySelector("simple-dialog") as SimpleDialog).resultCallback = 
      (result: string) => {
        console.log("dialog resultCallback: " + result)
        this.simpleDialogResult = result;
      }
    
    let data = this.getTextData().then((data) => {
      console.log("data=", data)
    })

    this.alertDialogEl = this.shadowRoot?.querySelector("alert-dialog") as HTMLElement;
    this.alertDialog = this.alertDialogEl as AlertDialog
    (this.alertDialogEl as AlertDialog).resultCallback = (result: AlertDialogResult) => {
      console.log("alertDialog resultCallback: " + JSON.stringify(result, null, 2))
      this.alertDialogResult = result
    }

    let animEl = this.shadowRoot?.querySelector("#anim") as HTMLElement;
    animEl.animate([
      { transform: 'scale(1)', opacity: 1, offset: 0 },
      { transform: 'scale(.5)', opacity: .5, offset: .3 },
      { transform: 'scale(.667)', opacity: .667, offset: .7875 },
      { transform: 'scale(.6)', opacity: .6, offset: 1 }
    ], {
      duration: 1000, //milliseconds
      easing: 'ease-in-out', //'linear', a bezier curve, etc.
      delay: 10, //milliseconds
      iterations: Infinity, //or a number
      direction: 'alternate', //'normal', 'reverse', etc.
      fill: 'forwards' //'backwards', 'both', 'none', 'auto'
    });
  }

  async getJsonData(): Promise<any> {
    const response = await fetch('/src/app-json.json')
    return await response.json()
  }

  async getTextData(): Promise<string> {
    const response = await fetch('/src/app-json.json')
    return await response.text()
  }

  simpleDialogResultString() {
    let value = this.simpleDialogResult;
    if(value == "btn_cancel") {
      return "Clicked Cancel";
    } else if(value == "btn_confirm") {
      return "Clicked Confirm";
    }
  }

  private _kindChange(e: Event) {
    this.names.kind = (e.target as HTMLSelectElement).value as Names.Kind;
  }

  render() {
    const formattedTime = this._timeFormat.format(this._clock.value);

    return html`
      <div class="wrapper">
        <style>
          img {
            /* rounded corners */
            border-radius: 15px;
            /* add a shadow */
            box-shadow: 0 0 10px rgba(1, 1, 1, 0.7);
            margin-bottom: 5px;
          }
        </style>
        
        <h1>This is the page for Virtualizers & Controllers</h1>
        <h3>Should be called "FastList", "LitList" or "QuickList"</h3>
        <br>
        <br>
        <h3>Docs for @lit-labs/virtualizer</h3>
        <a href="https://www.youtube.com/watch?v=ay8ImAgO9ik" target="_blank">Lit Labs Virtualizer</a><br> 
        <a href="https://codesandbox.io/s/litelement-typescript-litvirtualizer-sxjsww?file=/src/x-row-scroller.ts" target="_blank">Horizontal Scroller</a>
        <br>
        <br>
        <h3>Controllers</h3>
        <p>Current time: ${formattedTime}</p>
        <!-- Send message to the controller -->
        <button @click=${() => { this._clock.logThis() }}>this._clock.logThis()</button>
        <br>
        <br>
        <h4>Names List</h4>
          Kind: <select @change=${this._kindChange}>
          ${this.names.kinds.map(
            (key) => html`<option value=${key}>${key}</option>`)
          }
        </select>
        ${this.names.render({
          complete: (result: Names.Result) => html`
            <p>List of ${this.names.kind}</p>
            <ul>${result.map(i => html`<li>${i.name}</li>`)}
            </ul>
          `,
          initial: () => html`<p>Select a kind...</p>`,
          pending: () => html`<p>Loading ${this.names.kind}...</p>`,
          error: (e: any) => html`<p style="color: red;">${e}</p>`
        })}
        <br>

        <h3>SimpleDialog</h3>
        <simple-dialog></simple-dialog>
        <br>
        <p>${this.simpleDialogResultString()}</p>
        <br>

        <h3>MDC Alert Dialog</h3>
        <button @click=${() => { 
            this.alertDialog?.openDialog() 
          }}>Open MDC Alert Dialog</button>
        <br>
        <alert-dialog id="alert-dialog"></alert-dialog>
        <p>${JSON.stringify(this.alertDialogResult)}</p>
        <br>
        <br>

        <h3 id="anim" style="backdrop-filter: blur(200px);">Virtualizer</h3>

        <!-- This is the original naîve version that will bog-down rendering performance any browser -->
        <!-- 
          ${repeat(
            Array.from({ length: 1000 }, (_, i) => i),
              (item) => html`<img src="https://picsum.photos/seed/${item + 1}/200/300.jpg" />`
          )} 
        -->
      

        <!-- simple example -->
        <!--
        <img src="https://picsum.photos/seed/1/200/300.jpg" />
        <lit-virtualizer
          scroller
          .items=${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          .renderItem=${(item: any) => html`<p>hello ${item}</p>`}
          ></lit-virtualizer>
        <br>
        -->

        <!-- for the standard lit-virtualized element -->
        <button 
          @click=${() => {
            // this.shadowRoot?.querySelector("#virtualizer") // js
            (this.shadowRoot?.querySelector("#virtualizer1") as LitVirtualizer) // ts
              .element(30)
              ?.scrollIntoView()
          }}>Scroll to Element 30 
        </button>
        <br>
        <br>
        <!-- This is using the virtualizer element -->
        <!-- Can also use direction: 'horizontal' -->
        <!-- Can also use direction: 'vertical' -->
        <!-- scroller makes the element a viewport-->
        <!-- .layout=${flow({ direction: 'vertical' })}  -->
        <lit-virtualizer id="virtualizer1" 
          scroller style="height: 350px; width: 100%; overflow: auto;"
          .items=${Array.from({ length: 1000 }, (_, i) => i)}
          .renderItem=${(item: number) => 
            html`
            <div>
              <img src="https://picsum.photos/seed/${item + 1}/200/300.jpg" />
              <p>${item}</p>
            </div>`
          }
        ></lit-virtualizer>
        <br>


        <!-- This is using the virtualize function & the scrollToListItem -->
        <!-- for the virtualized <ul> element -->
        <button 
          @click=${() => { this.scrollToListItem(30); }}
          >Scroll to Element 30 in &lt;ul&gt;
        </button>
        <br>
        <div id="virtualizer2">
          <ul>
          ${virtualize({
            items: this.data,
            renderItem: (i) => html`<li>${i.text}</li>`,
          })}
          </ul>
        </div> 

        <!-- This is using the virtualize function & grid layout (2 columns only right now :( ) -->
        <!-- 
        <div id="virtualizer3">
          ${virtualize({
            items: Array.from({ length: 1000 }, (_, i) => i),
            renderItem: item => html`<img src="https://picsum.photos/seed/${item + 1}/200/300.jpg" />`,
            layout: grid(),
          })}
        </div> 
        -->

        </div>
    `
  }

  // Uses the reference to the <ul> element in the template.
  // For use with id=virtualizer3.
  scrollToListItem(idx: number) {
    (this.list as any)[virtualizerRef]
      .element(idx)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
// customElements.define('page-virtualizers', PageVirtualizers);  // js
