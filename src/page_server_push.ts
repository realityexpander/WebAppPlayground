import { LitElement, html, css } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';
import { customElement, property, query, state } from 'lit/decorators.js';
import { authService } from './authenticationService.js';

import { MDCTextField } from '@material/textfield';

@customElement('page-server-push')  // ts
class PageServerPush extends LitElement {

  static styles = [
    styles,
  ];

  // @state()
  // result: string

  @query("#messageOutput")
  messageOutput!: HTMLElement;

  @query("#search") 
  searchInput!: HTMLInputElement;

  searchField: MDCTextField | undefined
  onSearchInput: (searchValue: string) => void 

  @query("#searchOutput")
  searchOutput!: HTMLElement;

  constructor() {
    super()

    this.onSearchInput = PageServerPush.debounce(this.makeAPICall, 1000)
  }

  makeAPICall = (searchValue: string) => {
    this.searchOutput.innerHTML = ""
    if (!searchValue) {
        return
    }
  
    // Search for books with the given title
    fetch(`http://localhost:8081/libraryApi/findBook/title/${searchValue}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authService.getAuthenticationToken(),
          },
        })
        .then((response) => {
          if (response.ok == false) {
            throw new Error(response.statusText);
          }
          response.json().then((response: any[]) => {
              response.forEach((item: any) => {
                  const div = document.createElement("div")
                  div.textContent = item.title
                  div.classList.add("item")
                  this.searchOutput.appendChild(div)
              })
              if(response.length == 0) {
                const div = document.createElement("div")
                div.textContent = "No results found"
                this.searchOutput.appendChild(div)
              }
          });
        })
        .catch((error) => { 
          console.error('search Error:', error);

          const div = document.createElement("div")
          div.textContent = error
          this.searchOutput.appendChild(div)
        })
  }
    
  static debounce = (fn: (...args: any) => void, delay = 1000) => {
      let timerId: number | undefined | NodeJS.Timeout = undefined;
      return (...args: any) => {
          clearTimeout(timerId)
          timerId = setTimeout(() => fn(...args), delay)
      }
  }

  firstUpdated() {
    // open websocket connection
    const socket = new WebSocket("ws://localhost:8081/redis/getMessages")
    // listen for messages
    socket.addEventListener("message", (event) => {
      // console.log("Message from server ", event.data)
      if(event.data != "No new messages") {
        let curHtml = this.shadowRoot!.getElementById("messageOutput")!.innerHTML 
        let data = JSON.parse(event.data)
        let prettyData = JSON.stringify(data, null, 2)
        // this.shadowRoot!.getElementById("output")!.innerHTML = curHtml + "<pre>" + prettyData + "</pre>"
        this.messageOutput.innerHTML = curHtml + "<pre>" + prettyData + "</pre>"
      }
    })

    // listen for search input
    // this.shadowRoot!.getElementById("search")!
    this.searchInput.addEventListener("input", (e) => {
      let searchInput = (e.target as HTMLInputElement).value
      this.onSearchInput(searchInput)
    });

    this.searchField = new MDCTextField(this.shadowRoot!.querySelector('.mdc-text-field')!);
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
        <pre id="messageOutput"></pre>
        <br>

        <h2>Search with debounce</h2>
        <label class="mdc-text-field mdc-text-field--outlined" style="width:100%;">
          <span class="mdc-text-field__ripple"></span>
          <span class="mdc-floating-label" id="hint-email-address">Search Book Titles...</span>
          <input id="search" class="mdc-text-field__input" type="text" aria-labelledby="hint-email-address">
          <span class="mdc-line-ripple"></span>
        </label>
        <br>
        <pre id="searchOutput"></pre>

      </div>
    `
  }

}


