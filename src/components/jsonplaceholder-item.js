class JsonPlaceholder extends HTMLElement {

  static get componentStyle() {
    return `
    .item_group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.1rem;
      border: 1px solid #ccc;
      border-radius: 0.25rem;
      margin-bottom: 0.2rem;
    }
    .item__text {
      flex: 1;
      margin: 1.2rem;
    }
    .item__button {
      padding: 0.15rem 0.1rem;
      border: 1px solid #ccc;
      border-radius: 0.25rem;
      background-color: #fff;
      cursor: pointer;
    }
    .item__button:hover {
      background-color: #eee;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.1rem;
      border: 1px solid #ccc;
      border-radius: 0.25rem;
      margin-bottom: 0.1rem;
    }
    label {
      margin: 0;
      padding: 0;
    }
    h4 {
      margin: 0;
      padding: 1rem 1rem 0 1rem;
    }
    img {
      margin: 0;
      padding: 0;
    }
  `
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        ${JsonPlaceholder.componentStyle}
      </style>

      <label id="display" class="item">
        <span id="loading">
            <span>Loading...</span>
            <img id="loading" src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator.gif" width="30px" height="30px" alt="loading"/>
        </span>

        <span class="item__text">
          <slot></slot> 
        </span>

        <p id="error" hidden>Error</p>
      </label>
    `;
    shadowRoot.append(template.content.cloneNode(true));

    // Internal Object properties
    this._id = null
    this._data = null
    this._state = "loading"  // "loading", "loaded", "error"
  }

  connectedCallback() {
    this.state = "loading"
  }

  disconnectedCallback() {
  }

  _onConfirmDelete() {
    this._UiState = "confirm-delete"
    this.shadowRoot.querySelector('#editors-buttons').hidden = true;
    this.shadowRoot.querySelector('#confirm-delete').hidden = false;

    this.shadowRoot.querySelector('#button-yes-delete').addEventListener('click', this._onDelete.bind(this));
    this.shadowRoot.querySelector('#button-cancel-delete').addEventListener('click', this._onCancelDelete.bind(this));
  }

  _removeConfirmDeleteListeners() {
    this.shadowRoot.querySelector('#button-yes-delete').removeEventListener('click', this._onDelete.bind(this));
    this.shadowRoot.querySelector('#button-cancel-delete').removeEventListener('click', this._onCancelDelete.bind(this));
  }

  _onCancelDelete() {
    this._UiState = ""
    this.shadowRoot.querySelector('#editors-buttons').hidden = false;
    this.shadowRoot.querySelector('#confirm-delete').hidden = true;

    this._removeConfirmDeleteListeners();
  }

  _onOKDelete() {
    this._UiState = ""
    this.shadowRoot.querySelector('#editors-buttons').hidden = false;
    this.shadowRoot.querySelector('#confirm-delete').hidden = true;

    this._removeConfirmDeleteListeners();
    this._onDelete()
  }

  _onDelete() {
    this.dispatchEvent(new CustomEvent('delete', {
      bubbles: true,
      composed: true,
      detail: "composed",
    }));
  }

  static observedAttributes = ["state", "url", "id", "reqBody"];

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
    }
  }

  get id() {
    return this._id ?? "";
  }

  set id(v) {
    this.setAttribute("id", v)
    this._id = v
  }

  get state() {
    return this._state ?? "";
  }
  set state(v) {
    this.setAttribute("state", v);
    this._state = v
    this._updateUIFromState();
  }

  get src() {
    return this._url ?? "";
  }
  set src(v) {
    this.setAttribute("url", v);
    this._url = v
    this._performFetch();
  }

  _updateUIFromState() {
    this.shadowRoot.querySelector('slot').textContent = this._data;

    if (this._state === "loaded") {
      this.shadowRoot.querySelector('#display').hidden = false;
      this.shadowRoot.querySelector('#loading').hidden = true;
      this.shadowRoot.querySelector('#error').hidden = true;
    }

    if (this._state === "loading") {
      this.shadowRoot.querySelector('#display').hidden = true;
      this.shadowRoot.querySelector('#loading').hidden = false;
      this.shadowRoot.querySelector('#error').hidden = true;
    }

    if (this._state === "error") {
      this.shadowRoot.querySelector('#display').hidden = true;
      this.shadowRoot.querySelector('#loading').hidden = true;
      this.shadowRoot.querySelector('#error').hidden = false;
    }
  }

  _performFetch() {
    if (this._url == undefined) return

    const todo = [{
      id: 12345,
      name: "Hello Name",
      status: "Pending",
    }];

    let request = new Request(this._url, {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
      // Note: "mode: 'no-cors'" is not needed if the server is setup to allow CORS. 
      // If using "mode: 'no-cors'", the response will be opaque and the `response.ok` will be false 
      // but the `response.status` will be 200. The response will not be able to be parsed as JSON.
      // The request will still be sent to the server, but the response will not be returned to the client.
      // mode: 'no-cors', 
    });

    fetch(request)
      .then(response => response.json())
      .then(json => {
        this._id = json[0].id
        this._data = json[0].name + ", completed:" + json[0].status

        this.state = "loaded"
      }
      )
  }

}
customElements.define('jsonplaceholder-item', JsonPlaceholder);
