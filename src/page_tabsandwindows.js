import { LitElement, html } from 'lit';
import { styles } from './modified-material-components-web.min.css.js';

class TabsAndWindows extends LitElement {

  static get properties() {
    return {
      category: { type: String },
      someOtherGlobalProp: { type: String }
    }
  }

  static styles = styles;
  static get localStlyes() {
    return `
    * {
      box-sizing: border-box;
      font-family: inherit;
    }
    :root {
      color-scheme: dark light;
    }
    html,
    body {
      font-size: 20px;
      font-family: sans-serif;
      padding: 0;
      margin: 0;
      min-height: 100vh;
    }
    header,
    main {
      padding: 1rem 3rem;
    }
    button {
      font-size: 1rem;
      padding: 0.2rem 2rem;
      margin: 0 2rem;
    }
  `;
  }

  constructor() {
    super();
    this.category = '';
    this.someOtherGlobalProp = '';
  }

  firstUpdated() {
    let btnTab = this.shadowRoot.getElementById('btnTab');
    btnTab.addEventListener('click', this.openTab.bind(this));

    let btnWin = this.shadowRoot.getElementById('btnWin');
    btnWin.addEventListener('click', this.openWin.bind(this));
  }

  render() {
    // If provided, the properties for type and day are taking from the path.
    return html`
    <style>
      ${this.localStlyes}
    </style>
    <div class="wrapper">
      <h1>Opening Tabs and Windows</h1>
      <br><br>

      <button id="btnTab">Open A Tab</button>
      <br><br>

      <button id="btnWin">Open A PopUp Window</button>
    </div>
      `
  }

  openTab(ev) {
    console.log('open a tab');
    let win = window.open('tab.html', null);

    // Set the background color of the new tab upon load
    win.onload = (ev) => {
      win.document.body.style.backgroundColor = '#999';
      setTimeout(() => {
        win.close();
      }, 2500);
    };
  }

  openWin(ev) {
    console.log('open a popup window');
    // // note: noopener prevents the new window from accessing the opener's window object, is not supported in IE
    // let win = window.open(
    //   'win.html',
    //   null,
    //   'popup,width=400,height=400,left=300,top=500, noopener' 
    // );
    let win = window.open(
      '',
      null,
      'popup,width=400,height=400,left=300,top=500'
    );
    win.document.write(
      '<html><head><title>Sample</title></head><body>Sample</body></html>'
    );
    // win.onload = () => {  // only works if not using document.write to load the html for page
    let timmy = setInterval(() => {
      let w = Math.random() * parseInt(window.screen.availWidth);
      let h = Math.random() * parseInt(window.screen.availHeight);
      win.resizeTo(w, h);
    }, 1000);

    setTimeout(() => {
      clearInterval(timmy);
      win.close();
    }, 6000);
    // };
  }

}
customElements.define('page-tabsandwindows', TabsAndWindows);