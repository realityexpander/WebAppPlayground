import { LitElement, html } from 'lit';
import { styles } from './modified-material-components-web.min.css.js';

class Stocks extends LitElement {

  static get properties() {
    return {
      type: { type: String },
      day: { type: String }
    }
  }

  constructor() {
    super();
    this.type = undefined;
    this.day = undefined;

    // Honor trailing hash in URL
    if (window.location.hash != '') {
      // scroll to hash
      setTimeout(() => {
        const anchor = window.location.hash.split('#')[1];
        const element = this.shadowRoot.getElementById(anchor);
        if (element) {
          element.scrollIntoView();
        }
      }, 100);

    }
  }

  static styles = styles;

  render() {
    // If provided, the properties for type and day are taking from the path.
    //const { type = 'NASDAC', day = 'monday' } = this.routeProps;
    if (this.type === undefined) {
      return html`
      <div class="wrapper">
        This is the page for stocks, no type or day provided.
        <br>
      
        <a href="/">Home</a>
        <br>
        1 <br>
        2 <br>
        3 <br>
        4 <br>
        5 <br>
        6 <br>
        7 <br>
        8 <br>
        9 <br>
        10 <br>
        11 <br>
        12 <br>
        13 <br>
        14 <br>
        15 <br>
        16 <br>
        17 <br>
        18 <br>
        19 <br>
        20 <br>
        1 <br>
        2 <br>
        3 <br>
        4 <br>
        5 <br>
        6 <br>
        7 <br>
        8 <br>
        1 <br>
        2 <br>
        3 <br>
        1 <br>
        2 <br>
        3 <br>
        4 <br>
        5 <br>
        6 <br>
        7 <br>
        8 <br>
        9 <br>
        10 <br>
        11 <br>
        12 <br>
        13 <br>
        14 <br>
        15 <br>
        16 <br>
        17 <br>
        18 <br>
        19 <br>
        20 <br>
        4 <br>
        5 <br>
        6 <br>
        7 <br>
        8 <br>
        9 <br>
        10 <br>
        11 <br>
        12 <br>
        13 <br>
        14 <br>
        15 <br>
        16 <br>
        17 <br>
        18 <br>
        19 <br>
        20 <br>
        <p id="3">Anchor 3</p>
        9 <br>
        10 <br>
        11 <br>
        12 <br>
        13 <br>
        14 <br>
        15 <br>
        16 <br>
        17 <br>
        1 <br>
        2 <br>
        3 <br>
        4 <br>
        5 <br>
        6 <br>
        7 <br>
        8 <br>
        9 <br>
        10 <br>
        11 <br>
        12 <br>
        13 <br>
        14 <br>
        15 <br>
        16 <br>
        17 <br>
        18 <br>
        19 <br>
        20 <br>
        1 <br>
        2 <br>
        3 <br>
        4 <br>
        5 <br>
        6 <br>
        7 <br>
        8 <br>
        9 <br>
        10 <br>
        11 <br>
        12 <br>
        13 <br>
        14 <br>
        15 <br>
        16 <br>
        17 <br>
        18 <br>
        19 <br>
        20 <br>
        18 <br>
        19 <br>
        20 <br>
        1 <br>
        2 <br>
        3 <br>
        4 <br>
        5 <br>
        6 <br>
        7 <br>
        8 <br>
        9 <br>
        10 <br>
        11 <br>
        12 <br>
        13 <br>
        14 <br>
        15 <br>
        16 <br>
        17 <br>
        18 <br>
        19 <br>
        20 <br>
        <br>
        <p id="1">Anchor 1</p>
        <p id="2">Anchor 2</p>
        <br>
      </div>
        `
    }

    return html`This is the page for ${this.type} on a ${this.day}`
  }

  firstUpdated() {
    // console.log(this.type);
    // console.log(this.day);
  }

  // tear down the component
  disconnectedCallback() {
    super.disconnectedCallback();

  }
}
customElements.define('page-stocks', Stocks);