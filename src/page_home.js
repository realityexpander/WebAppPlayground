import { LitElement, html } from 'lit';
import './components/date-picker.js';
import './components/my-counter.js';
import './components/my-element.js';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';
import { globalProp } from './globalProp.js';
import { authService } from './authenticationService.js';

class Home extends LitElement {
  static styles = styles;

  constructor() {
    super();
    console.log('Home constructor: globalProp = ' + globalProp);
    console.log('Home constructor: appProp = ' + document.querySelector('app-root').appProp);

    this.menu = null;
  }

  async getTodos() {

    const response = await fetch('/api/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authService.getAuthenticationToken(),
      },
    })
      .then(response => {
        if (response.ok == false) {
          throw new Error(response.statusText);
        }
        return response.json()
      })
      .then(data => {
        if (data == undefined || data == null) {
          throw new Error('No data or data is malformed');
        }

        const todoListEl = this.shadowRoot.querySelector('#todo-list');
        todoListEl.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
          const todoEl = document.createElement('div');
          todoEl.innerHTML =
            `
          <div>
            <p>${data[i].name}</p> 
            <div style="padding-left: 30px;" 
              <p>${data[i].status}</p> 
              <p>${JSON.stringify(data[i].user)}</p> 
            </div> 
          </div>
          `.trim();
          todoListEl.appendChild(todoEl);
        }
      })
      .catch((error) => {
        console.error('getTodos Error:', error);
      });
  }

  async getJwtProtectedEndpoint() {
    const outputEl = this.shadowRoot.querySelector('#jwt-protected-endpoint');

    const response = await fetch('/api/hello', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authService.getAuthenticationJwtToken(),
      },
    })
      .then(response => {
        if (response.ok == false) throw new Error(response.statusText);
        return response.json()
      })
      .then(data => {
        if (data == undefined || data == null) {
          throw new Error('No data or data is malformed');
        }
        outputEl.innerHTML = JSON.stringify(data);
      })
      .catch((error) => {
        console.error('getJwtProtectedEndpoint Error:', error);
        outputEl.innerHTML = error;
      });
  }

  render() {
    // If provided, the properties for type and day are taking from the path.
    //const { type = 'NASDAC', day = 'monday' } = this.routeProps;
    return html`
      <div class="wrapper">
        This is the page for Home ${this.routeProps}
        <br>
        <a href="/">Home</a>
        <a href="/stocks">Stocks</a>
        <a href="/trade/123">Trade</a>
        <a href="/news/tech">News</a><br>
        <br>

        <a href="/simpletables">SimpleTables</a><br>
        <a href="/virtualizers">Virtualizers</a><br>
        <a href="/slot-dialog">Slot-dialog</a><br>
        <br>
        <br>

        <button @click=${() => window.location = '/stocks'}>Go to stocks</button>
        <br>
        <br>

        <button 
          @click=${() => window.location = '/typescript-test'} 
          id="btn-nav-to-typescript" 
          class="mdc-button mdc-button--outlined smaller-text"
        >
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Typescript Test</span>
        </button>
        <br>
        <br>

        <button @click=${() => window.location = '/files'} id="btn-nav-to-files" class="mdc-button mdc-button--outlined
          smaller-text">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Manage Files</span>
        </button>
        <br>
        <br>

        <button @click=${() => window.location = '/tabsandwindows'} id="btn-nav-to-tabsandwindows" class="mdc-button mdc-button--outlined
          smaller-text">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Tabs and Windows</span>
        </button>
        <br>
        <br>

        <button @click=${() => window.location = '/broadcast-message'} id="btn-nav-to-tabsandwindows" class="mdc-button mdc-button--outlined
          smaller-text">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Broadcast Messages</span>
        </button>
        <br>
        <br>

        <button @click=${() => window.location = '/web-worker'} id="btn-nav-to-web-worker" class="mdc-button mdc-button--outlined
          smaller-text">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Web Worker</span>
        </button>
        <br>
        <br>

        <button @click=${() => this.getJwtProtectedEndpoint()} id="btn-get-jwt-protected-endpoint" class="mdc-button mdc-button--outlined
          smaller-text">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Get JWT Protected Endpoint</span>
        </button>
        <br>
        <div id="jwt-protected-endpoint"></div>
        <br>
        <br>

        <button @click=${() => this.getTodos()} id="btn-get-todos" class="mdc-button mdc-button--outlined smaller-text">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Get Todos</span>
        </button>
        <br>
        <div id="todo-list"></div>
        <br>


        <!-- <date-picker date="08/07/1968" @click=${() => this.toggleAttribute('open')}></date-picker> -->
        <date-picker 
          id="date-picker"
          date="08/07/1968" 
          position="right"
          format="DDDD MM/DD/YYYY"
          class="date-toggle"
        ></date-picker>
        <button class="mdc-button mdc-button--outlined smaller-text"
          @click=${(evt) => { this.shadowRoot.querySelector("#date-picker").toggleCalendar(evt, true) }}
        >
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Pick Date</span>
        </button>
        <br>
        <p id="date-picked"></p>
        <br>

        <button @click=${() => this.logout()}>Log Out</button>
        <br>

        <button @click=${() => this.openLogoutMenu()} id="btn-logout" class="mdc-button mdc-button--outlined smaller-text">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Log Out</span>
        </button>
        <br>
        <br>


        <!-- Email Address Text Entry -->
        <label class="mdc-text-field mdc-text-field--filled">
          <span class="mdc-text-field__ripple"></span>
          <span class="mdc-floating-label" id="hint-email-address">Email Address</span>
          <input id="ti-email-address" class="mdc-text-field__input" type="email" aria-labelledby="my-label-id">
          <span class="mdc-line-ripple"></span>
        </label>
        <br>
        <div id="ti-text-area">Email here</div>
        <br>
      
        <!-- Logout popup -->
        <div class="mdc-menu-surface--anchor mdc-menu mdc-menu-surface" id="menu-logout">
          <ul class="mdc-deprecated-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
            <li id="menu-item-logout-confirm" class="mdc-deprecated-list-item" role="menuitem">
              <span class="mdc-deprecated-list-item__ripple"></span>
              <span class="mdc-deprecated-list-item__text">Log Out</span>
            </li>
            <li id="menu-item-logout-cancel" class="mdc-deprecated-list-item" role="menuitem">
              <span class="mdc-deprecated-list-item__ripple"></span>
              <span class="mdc-deprecated-list-item__text">Cancel</span>
            </li>
          </ul>
        </div>
    

      </div>
      `
  }

  datePicked(date) {
    this.shadowRoot.querySelector('#date-picked').textContent = date.detail.date;
  }

  firstUpdated() {
    const buttons = this.shadowRoot.querySelectorAll('.mdc-button');
    for (let i = 0, button; button = buttons[i]; i++) {
      mdc.ripple.MDCRipple.attachTo(button);
    }

    /////////////////////////////////////////////////////////////
    // listen for text changes to Email Address
    const emailAddressEl = this.shadowRoot.querySelector('#ti-email-address');
    const emailAddress = mdc.textField.MDCTextField.attachTo(this.shadowRoot.querySelector('.mdc-text-field--filled'));
    const emailTiTextArea = this.shadowRoot.querySelector('#ti-text-area');
    // emailAddressEl.addEventListener('input', (e) => {
    //   document.querySelector('#ti-text-area').textContent = e.target.value;
    //   state.email = e.target.value;
    // });
    emailAddress.foundation.adapter.registerInputInteractionHandler('input', (e) => {
      emailTiTextArea.textContent = e.target.value;
      // state.email = e.data; // when using input event, e.data is the character typed
    });

    const menuEl = this.shadowRoot.querySelector('#menu-logout');
    this.menu = new mdc.menu.MDCMenu(menuEl);
    this.menu.setAnchorElement(this.shadowRoot.querySelector('#btn-logout'));
    this.menu.setFixedPosition(true);
    menuEl.addEventListener('MDCMenu:selected', this.handleSelected_Menu_Logout.bind(this));
    menuEl.addEventListener('MDCMenuSurface:closed', this.handleCancel_Menu_Logout.bind(this));
  }

  logout() {
    // send logout message
    this.dispatchEvent(new CustomEvent('logout', {
      bubbles: true,
      composed: true,
      detail: {
        message: 'logout'
      }
    }));

  }

  openLogoutMenu() {
    this.menu.open = true;
  }

  handleSelected_Menu_Logout(e) {
    console.log('handleSelected_Menu_Logout', e.detail);

    let menuItemElement = this.menu.getOptionByIndex(e.detail.index).textContent;

    if (e.detail.item.id === 'menu-item-logout-confirm') {
      this.logout();
    }
  }

  handleCancel_Menu_Logout(e) {
    console.log('handleCancel_Menu_Logout', e.detail);
  }
}
customElements.define('page-home', Home);