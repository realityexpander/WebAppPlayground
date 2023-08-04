import { LitElement, html } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';
import './components/simple-greeting.js';


function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

class TypescriptTest extends LitElement {

  static styles = styles;

  firstUpdated() {
  }

  render() {
    return html`
      <div class="wrapper">

        <style>
          * {
            --smart-arrow-size: 20px;
          }
        </style>
        
        This is the page for Typescript test
        <br>
        
        <!-- Typescript Test -->
        <simple-greeting></simple-greeting>
        <br>

      </div>
    `
  }
}
customElements.define('page-typescript-test', TypescriptTest);