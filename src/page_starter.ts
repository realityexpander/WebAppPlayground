import { LitElement, html, css } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';
import { customElement, property, query, state } from 'lit/decorators.js';

@customElement('page-animation1')  // ts
class PageAnimations1 extends LitElement {

  static styles = [
    styles,
  ];

  // @state()
  // result: string

  @query("#some-tag")
  tagEl!: HTMLElement

  constructor() {
    super();

  }

  firstUpdated() {
    
  }

  render() {
    return html`

      <div class="wrapper">
        
        <h1>This is the page for XXXX</h1>
        <br>
        <br>

      </div>
    `
  }

}


