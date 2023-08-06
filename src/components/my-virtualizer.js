// import { html, css, LitElement, PropertyValueMap } from 'lit';
import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { authService } from "../authenticationService";

import { LitVirtualizer } from '@lit-labs/virtualizer';

// @customElement('my-virtualizer') // ts
class MyVirtualizer extends LitElement {

  // @property()
  // bookId: string = '';
  bookId = '';

  // protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
  //   super.firstUpdated(_changedProperties);
  // }

  render() {
    // Not yet implemented

    return html`
      <script>
        import { LitVirtualizer } from '@lit-labs/virtualizer';
      </script>

      <div>MyVirtualizer: ${this.bookId}</div>

      <lit-virtualizer
          scroller
          .items=${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          .renderItem=${(item) => html`<p>hello ${item}</p>`}
      ></lit-virtualizer>
    `;
  }
}
customElements.define('my-virtualizer', MyVirtualizer);