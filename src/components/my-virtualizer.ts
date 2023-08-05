import {html, css, LitElement, PropertyValueMap} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import { authService } from "../authenticationService";

@customElement('my-virtualizer')
class MyVirtualizer extends LitElement {

  @property()
  bookId: string = '';

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties);
  }

  render() {
    return html`
      <div>MyVirtualizer: ${this.bookId}</div>
    `;
  }
}