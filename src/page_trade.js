import { LitElement, html } from 'lit';
import { styles } from './modified-material-components-web.min.css.js';

class Trade extends LitElement {
  render() {
    // If provided, the properties for type and day are taking from the path.
    return html`
      <div class="wrapper">
        This is the page for trades ${this.stockId}
        ${this.againstRate == undefined ? 'No rate given' : 'against rate: ' + this.againstRate}
      </div>
    `
  }

  static styles = styles;
}
customElements.define('page-trade', Trade);