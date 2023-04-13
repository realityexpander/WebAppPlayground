import { LitElement, html } from 'lit';
import { styles } from './modified-material-components-web.min.css.js';

class News extends LitElement {

  static get properties() {
    return {
      category: { type: String },
      someOtherGlobalProp: { type: String }
    }
  }

  //static styles = styles;

  constructor() {
    super();
    this.category = '';
    this.someOtherGlobalProp = '';
  }

  firstUpdated() {
    // console.log(this.category);
    // console.log(this.someOtherGlobalProp);

    console.log("News firstUpdated");

    // set location from local storage
    const location = localStorage.getItem('location');
    if (location) {
      this.shadowRoot.querySelector('#location').innerHTML = location;
    }

    // get GPS location
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60 * 60 * 1 // 1 hour
    };
    let errorFn = (error) => {
      if (error) {
        this.shadowRoot.querySelector('#location').innerHTML = 'Error: ' + error.message;
        return;
      }
    };
    navigator.geolocation.getCurrentPosition((position) => {
      // navigator.geolocation.getCurrentPosition((position) => {
      console.log(position)
      const { latitude, longitude } = position.coords;
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.shadowRoot.querySelector('#location').innerHTML = data.display_name;

          localStorage.setItem('location', data.display_name);
        })
        .catch((error) => {
          this.shadowRoot.querySelector('#location').innerHTML = 'Error: ' + error;
        });
    },
      errorFn,
      options
    );
  }

  render() {
    // If provided, the properties for type and day are taking from the path.
    return html`
    <style>
      ${styles}

      /* CSS Grid Layout */
      .grid-container {
        width: 600px;
        -webkit-column-count: 3;
        -moz-column-count: 3;
        column-count: 3;
        
        -webkit-column-gap: 15px;
        -moz-column-gap: 15px;
        column-gap: 15px;
      }
      .grid-item {
        display: block;
        /* match gap size */
        margin-bottom: 15px;
      }
    </style>
    <div class="wrapper">
      <h1>News Items of the Day</h1>
      <p>This is the page for news.</p>
      <p>Category: ${this.category}</p>
      <p>Location: <span id="location"></span></p>
      <p>Some other global prop: ${this.someOtherGlobalProp}</p>

      <!-- This is the CSS Grid layout -->
      <div class="grid-container">
        <div class="grid-item">
          <img src="https://picsum.photos/200/300" alt="image">
        </div>
        <div class="grid-item">
          <img src="https://picsum.photos/200/400" alt="image">
        </div>
        <div class="grid-item">
          <img src="https://picsum.photos/200/500" alt="image">
        </div>
        <div class="grid-item">
          <img src="https://picsum.photos/200/300" alt="image">
        </div>
        <div class="grid-item">
          <img src="https://picsum.photos/200/600" alt="image">
        </div>
      </div>
    </div>
      `
  }

}
customElements.define('page-news', News);