import { LitElement, html, css } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';
import { customElement, property, query, state } from 'lit/decorators.js';

@customElement('page-library-app')  // ts
class PageLibraryApp extends LitElement {

  static styles = [
    styles,
    css`
      body, html {
        width: 100%; 
        height: 100%; 
        margin: 0; 
        padding: 0
      }
      .row-container {
        display: flex; 
        width: 100%; 
        height: 100%; 
        flex-direction: column; 
        // background-color: blue; 
        overflow: auto;
      }
      .first-row {
        background-color: lime; 
      }
      .second-row { 
        flex-grow: 1; 
        border: none;
        margin: 0; 
        padding: 0; 
      }
    `
  ];

  firstUpdated() {
   // set the iframe height to the window height minus the header height
    (this.shadowRoot!.getElementById("libraryApp")! as HTMLIFrameElement).height = 
      (window.innerHeight - (document.body.scrollHeight - window.innerHeight)).toString() 

    // listen for window resize events and adjust the iframe height accordingly
    window.addEventListener("resize", () => {
      (this.shadowRoot!.getElementById("libraryApp")! as HTMLIFrameElement).height = 
        (window.innerHeight - (document.body.scrollHeight - window.innerHeight)).toString() 
    })
  }

  render() {
    return html`

      <div class="row-container">
        <!-- <div class="first-row">
          <p>Header Text</p>
        </div> -->
        <iframe 
          class="second-row"
          id="libraryApp" 
          src="http://localhost:8081/libraryWeb/"
          height=${(window.innerHeight).toString()}
        ></iframe>

      </div>
    `
  }

}


