import { LitElement, html } from 'lit';
import { styles } from './modified-material-components-web.min.css.js';

class WebWorker extends LitElement {

  static styles = styles;

  #worker;
  #worker2;
  #broadcastChannel;

  render() {
    // If provided, the properties for type and day are taking from the path.
    return html`
      <div class="wrapper">
        <h1>Web Workers & Service Workers</h1>
        <br>
        
        <h2>Web Worker</h2>
        <button id="btnStartWebWorker">Start Web Worker</button>
        <br><br>

        <p>Calculations are are run in the web worker, and the results are sent back to the main thread.</p>
        <p>Calculations are not interruptable, and run to completion unless the worker is terminated.</p>
        <button id="btnCalculate">Run Calculation</button>
        <br><br>

        <button id="btnStartWebWorkerInterval">Start Interval</button>
        <br><br>

        <button id="btnStopWebWorkerInterval">Stop Interval</button>
        <br><br>

        <button id="btnStopWebWorker">Stop Web Worker</button>
        <br><br>
        <br><br>

        <h2>Web Worker 2 - alternate style</h2>
        <button id="btnStartWebWorker2">Start Web Worker 2</button>
        <br><br>

        <p>Worker listens for work and responds via event messaging.</p>
        <p>Calculations are done in chunks and are interruptable.</p>
        <button id="btnPauseWebWorker2">Pause Web Worker 2</button>
        <br><br>
        <button id="btnResumeWebWorker2">Resume Web Worker 2</button>
        <br><br>
        <button id="btnStopWebWorker2">Stop Web Worker 2</button>
        <br><br>
        <p>Messages from worker2:</p>
        <p id="messages2"></p>
        <br><br>

        <h2>Service Worker</h2>
        <button id="btnRegisterServiceWorker">Register Service Worker</button>
        <br><br>

        <p>
          The following demo illustrates the service worker's runtime caching by loading
          images in response to clicking the button below.
        </p>
        <p>
          The first time a given image is requested, the service worker will be load it
          from the network, but each subsequent time, it will be retrieved from the cache.
        </p>
        <label for="icons">Icons:</label>
        <select id="menu-icons">
          <option value="assets/icons/blue-ridge-trees.jpg">blue-ridge-trees</option>
          <option value="assets/icons/black-and-white-forest-lake-mist.jpg">black-and-white-forest-lake-mist</option>
          <option value="assets/icons/Desktop-Blurry-Backgrounds.jpg">Desktop-Blurry-Backgrounds</option>
          <option value="assets/icons/dock-circles-of-confusion.jpg">dock-circles-of-confusion</option>
          <option value="assets/icons/misty-mountains.jpg">misty-mountains</option>
          <option value="assets/icons/snow-dune-buggy.jpg">snow-dune-buggy</option>
          <option value="assets/icons/sunset-circles-of-confusion.jpg">sunset-circles-of-confusion</option>
        </select>
        <button id="show">Show Icon</button>
        <div id="container"></div>

      </div>
    `
  }


  firstUpdated() {

    // Web Worker
    let btnStartWebWorker = this.shadowRoot.getElementById('btnStartWebWorker');
    btnStartWebWorker.addEventListener('click', this.onStartWebWorker.bind(this));

    let btnStopWebWorker = this.shadowRoot.getElementById('btnStopWebWorker');
    btnStopWebWorker.addEventListener('click', this.onStopWebWorker.bind(this));

    let btnCalculate = this.shadowRoot.getElementById('btnCalculate');
    btnCalculate.addEventListener('click', this.onCalculate.bind(this));

    let btnStartWebWorkerInterval = this.shadowRoot.getElementById('btnStartWebWorkerInterval');
    btnStartWebWorkerInterval.addEventListener('click', this.onStartWebWorkerInterval.bind(this));

    let btnStopWebWorkerInterval = this.shadowRoot.getElementById('btnStopWebWorkerInterval');
    btnStopWebWorkerInterval.addEventListener('click', this.onStopWebWorkerInterval.bind(this));

    // Web Worker 2
    let btnStartWebWorker2 = this.shadowRoot.getElementById('btnStartWebWorker2');
    btnStartWebWorker2.addEventListener('click', this.onStartWebWorker2.bind(this));

    let btnPauseWebWorker2 = this.shadowRoot.getElementById('btnPauseWebWorker2');
    btnPauseWebWorker2.addEventListener('click', this.onPauseWebWorker2.bind(this));

    let btnResumeWebWorker2 = this.shadowRoot.getElementById('btnResumeWebWorker2');
    btnResumeWebWorker2.addEventListener('click', this.onResumeWebWorker2.bind(this));

    let btnStopWebWorker2 = this.shadowRoot.getElementById('btnStopWebWorker2');
    btnStopWebWorker2.addEventListener('click', this.onStopWebWorker2.bind(this));

    // Service Worker
    let btnRegisterServiceWorker = this.shadowRoot.getElementById('btnRegisterServiceWorker');
    btnRegisterServiceWorker.addEventListener('click', this.onRegisterServiceWorker.bind(this));

    let show = this.shadowRoot.getElementById('show');
    show.addEventListener('click', this.onShowIcon.bind(this));
  }

  onStartWebWorker() {
    if (this.#worker) {
      this.logWorkerMessage({ data: 'page_web_worker: Terminating Current WebWorker...' });
      this.#worker.terminate();
    }

    // Create a new worker
    this.#worker = new Worker('./scripts/workers/webworker.js');

    // Send a message to the worker
    this.#worker.postMessage('start');

    // Create BroadcastChannel
    this.#broadcastChannel = new BroadcastChannel('wkrp');

    // Listen for messages from the worker
    //this.#worker.addEventListener('message', this.logWorkerMessage.bind(this)); // alternative to the next line
    this.#worker.onmessage = (ev) => {
      this.logWorkerMessage(ev);
    }
  }

  onStopWebWorker() {
    if (this.#worker) {
      this.logWorkerMessage({ data: 'page_web_worker: Initiating Termination of WebWorker...' });

      this.#broadcastChannel.postMessage('stop');
      this.#worker = null;

      // this.#worker.terminate(); // immediately terminates the worker, no chance for cleanup

      return;
    }

    this.logWorkerMessage({ data: 'page_web_worker: WebWorker not started.' });
  }

  onCalculate() {
    if (this.#worker) {
      this.logWorkerMessage({ data: 'page_web_worker: Initiating Calculation...' });
      this.#broadcastChannel.postMessage('calculate');
      return;
    }

    this.logWorkerMessage({ data: 'page_web_worker: WebWorker not started.' });
  }

  onStartWebWorkerInterval() {
    if (this.#worker) {
      this.logWorkerMessage({ data: 'page_web_worker: Start Interval...' });
      this.#broadcastChannel.postMessage('start-interval');
      return;
    }

    this.logWorkerMessage({ data: 'page_web_worker: WebWorker not started.' });
  }

  onStopWebWorkerInterval() {
    if (this.#worker) {
      this.logWorkerMessage({ data: 'page_web_worker: Stop Interval...' });
      this.#broadcastChannel.postMessage('stop-interval');
      return;
    }

    this.logWorkerMessage({ data: 'page_web_worker: WebWorker not started.' });
  }

  logWorkerMessage(ev) {
    // Message received from the worker
    let messages = this.shadowRoot.getElementById('messages');
    messages.innerHTML += `<p>RECEIVED: ${JSON.stringify(ev.data)}</p>`;
  }

  onStartWebWorker2() {
    if (this.#worker2) {
      this.logWorkerMessage2({ data: 'page_web_worker: Terminating Current WebWorker2...' });
      this.#worker2.terminate();
    }

    // Create a new worker
    this.#worker2 = new Worker('./scripts/workers/worker2.js');

    // Log messages
    // this.#worker2.addEventListener("message", (ev) => { // longhand for onmessage
    //   this.logWorkerMessage2(ev);
    // });
    this.#worker2.onmessage = (ev) => {
      this.logWorkerMessage2(ev);
    }
    this.#worker2.onerror = (ev) => {
      this.logWorkerMessage2(ev);
    }

    // Send a message to the worker
    this.#worker2.postMessage({ command: 'start', payload: { id: Math.floor(Math.random() * 10000) } });
  }

  onPauseWebWorker2() {
    if (this.#worker2) {
      this.logWorkerMessage2({ data: 'page_web_worker: Initiating Pause of WebWorker2...' });
      this.#worker2.postMessage({ command: 'pause', payload: {} });
    }
  }

  onResumeWebWorker2() {
    if (this.#worker2) {
      this.logWorkerMessage2({ data: 'page_web_worker: Initiating Resume of WebWorker2...' });
      this.#worker2.postMessage({ command: 'resume', payload: {} });
    }
  }

  onStopWebWorker2() {
    if (this.#worker2) {
      this.logWorkerMessage2({ data: 'page_web_worker: Initiating Termination of WebWorker2...' });
      this.#worker2.terminate();
      this.#worker2 = null;
      return;
    }
  }

  logWorkerMessage2(ev) {
    // Message received from the worker
    let messages2 = this.shadowRoot.getElementById('messages2');
    messages2.innerHTML += `<p>RECEIVED: ${JSON.stringify(ev.data)}</p>`;
  }


  onRegisterServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./scripts/workers/serviceworker.js')
        .then((reg) => {
          // registration worked
          console.log('Registration succeeded. Scope is ' + reg.scope);
        }).catch((error) => {
          // registration failed
          console.log('Registration failed with ' + error);
        });
    }
  }

  onShowIcon() {
    let menuIcons = this.shadowRoot.getElementById('menu-icons');
    let container = this.shadowRoot.getElementById('container');
    let img = document.createElement('img');
    img.src = menuIcons.value;
    img.style = "width: 150px;"
    container.appendChild(img);
  }

}
customElements.define('page-web-worker', WebWorker);