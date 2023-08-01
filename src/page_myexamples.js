import { LitElement, html } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';

class MyExamples extends LitElement {
  render() {
    // If provided, the properties for type and day are taking from the path.
    return html`
      <div class="wrapper">
        This is the page for My Examples (my-counter, my-element)
        <br>
        <!-- My-Counter -->
        <my-counter></my-counter>
        <br>

        <!-- My-Element -->
        <my-element name="chris"></my-element>
      </div>
    `
  }

  static styles = styles;
}
customElements.define('page-myexamples', MyExamples);