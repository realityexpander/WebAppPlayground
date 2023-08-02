import { LitElement, html } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';
import './components/my-counter.js';
import './components/my-element.js';
import './components/jsonplaceholder-item.js';

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
        <br>

        <!-- Json Placeholder -->
        <jsonplaceholder-item src="http://localhost:8081/todo_echo"></jsonplaceholder-item>
      </div>
    `
  }

  static styles = styles;
}
customElements.define('page-myexamples', MyExamples);