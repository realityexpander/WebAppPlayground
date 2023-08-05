import { LitElement, html } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';

import './components/my-virtualizer.js';

class PageMyVirtualizer extends LitElement {

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
        
        <h1>This is the page for MyVirtualizer</h1>
        <br>
        <br>
        
        <h3>@lit-labs/virtualizer</h3>
        <!-- will cause error: -->
        <my-virtualizer bookId="UUID2:Role.Book@00000000-0000-0000-0000-000000001200"></my-virtualizer>
        <br>


      </div>
    `
  }
}
customElements.define('page-my-virtualizer', PageMyVirtualizer);