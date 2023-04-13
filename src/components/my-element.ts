/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = 'World';

  /**
   * The number of times the button has been clicked.
   */
  @property({type: Number})
  count = 0; 

  @property({type: String})
  myString = 'Hello';

  override render() {
    return html`
      <h1>${this.sayHello(this.name)}!</h1>
      <button @click=${this._onClick} part="button">
       
        Click Count: ${this.count}
        ${this.myString}
        
      </button>
      <slot></slot>
    `;
  }

  private _onClick() {
    this.count++;
    this.myString = this.getRandomStringOf5Characters();
    //this.dispatchEvent(event); // only dispatches inside this element
    let event = new CustomEvent('count-changed', 
      {
        detail: {
          count: this.count,
          source: this,
        },
      }
    );
    document.dispatchEvent(event); // dispatches globally
  }

  private getRandomStringOf5Characters() {
    return Math.random().toString(36).substring(2, 7);
  }

  /**
   * Formats a greeting
   * @param name The name to say "Hello" to
   */
  sayHello(name: string): string {
    return `Hello, ${name}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
