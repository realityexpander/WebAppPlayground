import { LitElement, html } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';

import './components/typescript-test.js';

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
        
        <h1>This is the page for TypescriptTest</h1>
        <br>
        <br>
        
        <!-- Typescript component -->
        <h3>@lit element using TypeScript</h3>
        <simple-greeting name="Freak"></simple-greeting>
        <br>
        
        <!-- Context -->
        <h3>@lit-labs/Context</h3>
        <root-element name="root1"></root-element>
        <br>

        <!-- Task -->
        <h3>@lit-labs/Task</h3>
        <!-- will cause error: -->
        <task-element bookId="UUID2:Role.Book@00000000-0000-0000-0000-000000001200"></task-element>
        <br>
        <task-element bookId="UUID2:Role.Book@00000000-0000-0000-0000-000000001100"></task-element>
        <br>

        <!-- Attribute Test -->
        <attr-test .srcObject="100" someId="1100" someId2="1200" someId3="1300">Attributes</attr-test>
        <br>

      </div>
    `
  }
}
customElements.define('page-typescript-test', TypescriptTest);