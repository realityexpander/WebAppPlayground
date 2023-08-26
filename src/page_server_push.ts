import { LitElement, html, css } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';
import { customElement, property, query, state } from 'lit/decorators.js';

@customElement('page-server-push')  // ts
class PageServerPush extends LitElement {

  static styles = [
    styles,
  ];

  // @state()
  // result: string

  constructor() {
    super();

  }

  firstUpdated() {
    // open websocket connection
    const socket = new WebSocket("ws://localhost:8081/redis/getMessages")
    // listen for messages
    socket.addEventListener("message", (event) => {
      // console.log("Message from server ", event.data)
      if(event.data != "No new messages") {
        let curHtml = this.shadowRoot!.getElementById("output")!.innerHTML 
        let data = JSON.parse(event.data)
        let prettyData = JSON.stringify(data, null, 2)
        this.shadowRoot!.getElementById("output")!.innerHTML = curHtml + "<pre>" + prettyData + "</pre>"
      }
    })
  }

  render() {
    return html`

      <div class="wrapper">
        
        <h1>This is the page for Server Push</h1>
        <br>
        <pre>
redis-cli -h localhost -p 6379
XADD mystream * {key} {value}
        </pre>
        <br>
        <pre id="output"></pre>


      </div>
    `
  }

}


