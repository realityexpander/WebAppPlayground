import { LitElement, html } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';
import './components/my-counter.js';
import './components/my-element.js';
import './components/fetch-todo-example.js';

import '../node_modules/smart-webcomponents/source/smart.element.js';
import '../node_modules/smart-webcomponents/source/smart.data.js';
import '../node_modules/smart-webcomponents/source/modules/smart.table.js';
import smart_styles from './style_scripts/smart_default_css.js';

import { MDCDataTable } from '../node_modules/@material/data-table/index.js';


function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

class MyExamples extends LitElement {

  static styles = styles;
  // static styles = smart_styles;

  firstUpdated() {
    // Smart Elements Table
    // Note: Dont create JS element using the built-in methods.
    // Create manually for web-component based elements, as so:
    const table = this.shadowRoot.querySelector('#table');
    table.dataSource = new Smart.DataAdapter(
      {
        dataSource: MyExamples.getCountriesData(),
        dataFields:
          [
            'ID: number',
            'Country: string',
            'Area: number',
            'Population_Urban: number',
            'Population_Rural: number',
            'Population_Total: number',
            'GDP_Agriculture: number',
            'GDP_Industry: number',
            'GDP_Services: number',
            'GDP_Total: number'
          ]
      })
    table.columns = [
      'Country',
      'Area',
      'Population_Rural',
      'Population_Total',
      'GDP_Total'
    ]
    table.sortBy('Population_Total', 'asc');
    table.disabled = false;


    // Material Design tables
    const dataTable = new MDCDataTable(this.shadowRoot.querySelector('.mdc-data-table'));

    // // note: does not sort automatically. Must respond to messages.
    // const dataTable2 = new MDCDataTable(this.shadowRoot.querySelector('.mdc-data-table2'));
    // dataTable2.listen('MDCDataTable:sorted', (event) => {
    //   const data = event.detail;
    //   this.sortTableByColumn(event.currentTarget, data.columnId, data.sortValue)
    // })
    // // send click to sort by carbs (column 2) (updates the icon & calls the correct sort)
    // dataTable2.getHeaderCells()[1].click()

    // this.dataTableAddRow({
    //   name: 'ADDED TO HTML PROGRAMMATICALLY',
    //   carbs: 7,
    //   protein: '4.0',
    //   comments: 'Super tasty'
    // }, this.shadowRoot.querySelector('.mdc-data-table2'))


    // Build DataTable HTML for Material Design
    let table3 = this.shadowRoot.querySelector('.mdc-data-table3')
    // const columnTitles = { name: "Dessert", carbs: "Carbs (g)", protein: "Protein (g)", comments: "Comments" }
    const columnTitles = { "Country": "XUNTRY", "Population_Urban": "Pop. City", "Population_Rural": "Pop. Kuntry" }
    let data1 = [
      {
        name: 'Frozen yogurt',
        carbs: 24,
        protein: '4.0',
        comments: 'Super tasty'
      },
      {
        name: 'Ice cream sandwich',
        carbs: 223,
        protein: '8.0',
        comments: 'CREEEAMY'
      },
      {
        name: 'Eclair',
        carbs: 623,
        protein: '23.6',
        comments: 'French treat'
      },
      {
        name: 'Pop Tart',
        carbs: 123,
        protein: '56.02',
        comments: 'What we used to call your mom'
      }
    ]
    let data = MyExamples.getCountriesData()
    table3.innerHTML = this.createDataTableHtml(data, "Desert Nutrition", columnTitles)
    // table3.innerHTML = this.createDataTableHtml(data, "Countries")
    const dataTable3 = new MDCDataTable(this.shadowRoot.querySelector('.mdc-data-table3'));
    dataTable3.listen('MDCDataTable:sorted', (event) => {
      const data = event.detail;
      this.sortTableByColumn(event.currentTarget, data.columnId, data.sortValue)
    })
    // dataTable3.getHeaderCells()[1].click() // select: column-2 asc
  }

  dataTableAddRow(data, table) {
    // add row to table
    let rowHtml = `
      <tr class="mdc-data-table__row">
        <td class="mdc-data-table__cell">${data.name}</td>
        <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
          ${data.carbs}
        </td>
        <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
          ${data.protein}
        </td>
        <td class="mdc-data-table__cell">
          ${data.comments}
        </td>
      </tr>

    `;
    let html = table.querySelector('table tbody').innerHTML
    table.querySelector('table tbody').innerHTML = ""
    table.querySelector('table tbody').innerHTML = html + rowHtml
  }

  createDataTableHeaderRowHtml(titleId, title) {
    return `
    <th
      class="
        mdc-data-table__header-cell 
        mdc-data-table__header-cell--with-sort"
      role="columnheader"
      scope="col"
      aria-sort="none"
      data-column-id="${titleId}"
    >
      <div class="mdc-data-table__header-cell-wrapper">
        <div class="mdc-data-table__header-cell-label">
          ${title}
        </div>
        <button class="mdc-icon-button material-icons mdc-data-table__sort-icon-button"
                aria-label="Sort by ${titleId}" aria-describedby="${titleId}-status-label">arrow_upward</button>
        <div class="mdc-data-table__sort-status-label" aria-hidden="true" id="${titleId}-status-label">
        </div>
      </div>
    </th>
    `;
  }

  createDataTableDataRowHtml(data, key) {
    let value = data[key]

    // Check if data is a number
    // if (Number(value) === value && value % 1 !== 0) {
    if (isNumeric(value) || !isNaN(value)) {
      // if (isNumeric(value) || (Number(value) == value && value % 1 !== 0)) {
      return `
        <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
          ${value}
        </td>
    `;
    }

    return `
        <td class="mdc-data-table__cell">${value}</td>
    `;
  }

  // Leave off columnTitles array to use the keys as the column titles
  createDataTableHtml(data, tableTitle = "Data Table", columnTitles) {

    let html = `
      <h3>${tableTitle}</h3>
      <table class="mdc-data-table__table" aria-label="${tableTitle}">
        <thead>
      `

    // Build the header
    html += `<tr class="mdc-data-table__header-row">`
    Object.keys(data[0]).forEach((key, idx) => {
      let columnTitle = key

      // If columnTitles is defined, use it and only include the columns that are defined.
      if (columnTitles && columnTitles[key]) {
        columnTitle = columnTitles[key]
        html += this.createDataTableHeaderRowHtml(key, columnTitle)
      }

      // If columnTitles is not defined, use the key as the column title and include all columns.
      if (!columnTitles) {
        html += this.createDataTableHeaderRowHtml(key, columnTitle)
      }
    })

    html += `
            </tr>
          </thead>
    `

    // Build the Data Rows
    html += `
        <tbody class="mdc-data-table__content">`
    data.forEach((row) => {
      html += `<tr class="mdc-data-table__row">`
      Object.keys(row).forEach((key) => {
        let columnTitle = key

        // If columnTitles is defined, use it and only include the columns that are defined.
        if (columnTitles && columnTitles[key]) {
          columnTitle = columnTitles[key]
          html += this.createDataTableDataRowHtml(row, key)
        }

        // If columnTitles is not defined, use the key as the column title and include all columns.
        if (!columnTitles) {
          html += this.createDataTableDataRowHtml(row, key)
        }

      })
      html += `</tr>`
    })
    html += `</tbody>`

    html += `
      </table>
    `

    return html
  }

  sortTableByColumn(table, column, order) {
    // get header & table content
    let headings = table.querySelector('table thead').querySelectorAll("th")
    const content = table.querySelector('table tbody').querySelectorAll("tr")

    // find index of `column` in `headings`
    let headingColumnId = Array.from(headings).map((heading) => {
      return heading.dataset.columnId
    })
    let sortColumnIndex = headingColumnId.indexOf(column)

    // Sort content
    let newContent = Array.from(content).sort((a, b) => {
      let aVal = Array.from(a.querySelectorAll("td"))[sortColumnIndex].innerText
      let bVal = Array.from(b.querySelectorAll("td"))[sortColumnIndex].innerText

      // Check if need to convert to numbers
      if (a.querySelectorAll("td")[sortColumnIndex].classList.contains("mdc-data-table__cell--numeric")) {
        aVal = Number(aVal)
        bVal = Number(bVal)

        if (aVal == bVal) return 0

        if (order == "ascending") {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      }

      // Text comparison
      if (order == "ascending") {
        return aVal.localeCompare(bVal)
      } else {
        return bVal.localeCompare(aVal)
      }
    })

    table.querySelector('table tbody').innerHTML = ""
    table.querySelector('table tbody').append(...newContent)
  }

  static getCountriesData() {
    return [
      {
        "ID": 1,
        "Country": "Brazil",
        "Area": 8515767,
        "Population_Urban": 0.85,
        "Population_Rural": 0.15,
        "Population_Total": 205809000,
        "GDP_Agriculture": 0.054,
        "GDP_Industry": 0.274,
        "GDP_Services": 0.672,
        "GDP_Total": 2353025
      },
      {
        "ID": 2,
        "Country": "China",
        "Area": 9388211,
        "Population_Urban": 0.54,
        "Population_Rural": 0.46,
        "Population_Total": 1375530000,
        "GDP_Agriculture": 0.091,
        "GDP_Industry": 0.426,
        "GDP_Services": 0.483,
        "GDP_Total": 10380380
      },
      {
        "ID": 3,
        "Country": "France",
        "Area": 675417,
        "Population_Urban": 0.79,
        "Population_Rural": 0.21,
        "Population_Total": 64395345,
        "GDP_Agriculture": 0.019,
        "GDP_Industry": 0.183,
        "GDP_Services": 0.798,
        "GDP_Total": 2846889
      },
      {
        "ID": 4,
        "Country": "Germany",
        "Area": 357021,
        "Population_Urban": 0.75,
        "Population_Rural": 0.25,
        "Population_Total": 82114224,
        "GDP_Agriculture": 0.008,
        "GDP_Industry": 0.281,
        "GDP_Services": 0.711,
        "GDP_Total": 3859547
      }
    ]
  }

  render() {
    return html`
      <div class="wrapper">

        <!-- Note: Cant load fonts here, load from main app index.html -->

        <!-- <script type="module" src="../node_modules/smart-webcomponents/source/modules/smart.table.js"></script> -->
        <link rel="stylesheet" type="text/css" href="/styles/smart.default.css" />
        <link rel="stylesheet" type="text/css" href="/styles/smart.variables.css" />
        <!-- <link rel="stylesheet" type="text/css" href="../node_modules/smart-webcomponents/source/style/smart.default.css"></link> -->
        <!-- <link rel="stylesheet" type="text/css" href="../node_modules/smart-webcomponents/source/style/smart.variables.css"></link> -->
        <style>
          /* .smart-table { */
          * {
          /* :root { */
            /* --smart-border-width: 1px; */
            /* --smart-border: red; */
            /* --smart-table-cell-padding: 2px;  */
            --smart-arrow-size: 20px;
          }

          .smart-table th {
            cursor: pointer;
          }

        </style>
        
        This is the page for Some Examples
        <br>
        
        <!-- My-Counter -->
        <my-counter></my-counter>
        <br>

        <!-- My-Element -->
        <my-element name="chris"></my-element>
        <br>

        <!-- Fetch component example -->
        <!-- <fetch-todo-example url="http://localhost:8081/todo_echo"></fetch-todo-example> -->
        <fetch-todo-example url="http://localhost:8081/libraryApi/fetchBookInfo/UUID2:Role.Book@00000000-0000-0000-0000-000000001100"></fetch-todo-example>
        <br>

        <!-- <smart-table id="table"></smart-table> -->
        <!-- <smart-table class="table-hover table-dark table-bordered table-striped" sort-mode="one" id="table"></smart-table> -->
        <smart-table class="table-hover table-bordered table-striped" sort-mode="one" id="table"></smart-table>
        
        <!-- Standard way using Smart Elements -->
        <!-- <div class="demo-description">
            Our Table web component can be used to wrap or replace standard Tables and add different styles, hover effects,
            sorting by one or multiple columns, add, remove and update rows.
        </div>
        <smart-table id="table">
            <table>
                <thead>
                    <tr>
                        <th scope="col">Country</th>
                        <th scope="col">Area</th>
                        <th scope="col">Population_Rural</th>
                        <th scope="col">Population_Total</th>
                        <th scope="col">GDP_Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Brazil</td>
                        <td>8515767</td>
                        <td>0.15</td>
                        <td>205809000</td>
                        <td>2353025</td>
                    </tr>
                </tbody>
            </table>
        </smart-table> -->


        <!-- Material Design table -->
        <div class="mdc-data-table">
          <div class="mdc-data-table__table-container">
            <table class="mdc-data-table__table" aria-label="Manufacturing Operations">
              <thead>
                <tr class="mdc-data-table__header-row">
                  <th class="mdc-data-table__header-cell mdc-data-table__header-cell--checkbox" role="columnheader" scope="col">
                    <div class="mdc-checkbox mdc-data-table__header-row-checkbox mdc-checkbox--selected">
                      <input type="checkbox" class="mdc-checkbox__native-control" aria-label="Toggle all rows"/>
                      <div class="mdc-checkbox__background">
                        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                        </svg>
                        <div class="mdc-checkbox__mixedmark"></div>
                      </div>
                      <div class="mdc-checkbox__ripple"></div>
                    </div>
                  </th>
                  <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Signal name</th>
                  <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Status</th>
                  <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Severity</th>
                  <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Stage</th>
                  <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Time</th>
                  <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Roles</th>
                </tr>
              </thead>
              <tbody class="mdc-data-table__content">
                <tr data-row-id="u0" class="mdc-data-table__row">
                  <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
                    <div class="mdc-checkbox mdc-data-table__row-checkbox">
                      <input type="checkbox" class="mdc-checkbox__native-control" aria-labelledby="u0"/>
                      <div class="mdc-checkbox__background">
                        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                        </svg>
                        <div class="mdc-checkbox__mixedmark"></div>
                      </div>
                      <div class="mdc-checkbox__ripple"></div>
                    </div>
                  </td>
                  <th class="mdc-data-table__cell" scope="row" id="u0">Arcus watch slowdown</th>
                  <td class="mdc-data-table__cell">Online</td>
                  <td class="mdc-data-table__cell">Medium</td>
                  <td class="mdc-data-table__cell">Triaged</td>
                  <td class="mdc-data-table__cell mdc-data-table__cell--numeric">0:33</td>
                  <td class="mdc-data-table__cell">Allison Brie</td>
                </tr>
                <tr data-row-id="u1" class="mdc-data-table__row mdc-data-table__row--selected" aria-selected="true">
                  <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
                    <div class="mdc-checkbox mdc-data-table__row-checkbox mdc-checkbox--selected">
                      <input type="checkbox" class="mdc-checkbox__native-control" checked aria-labelledby="u1"/>
                      <div class="mdc-checkbox__background">
                        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                        </svg>
                        <div class="mdc-checkbox__mixedmark"></div>
                      </div>
                      <div class="mdc-checkbox__ripple"></div>
                    </div>
                  </td>
                  <th class="mdc-data-table__cell" scope="row" id="u1">monarch: prod shared ares-managed-features-provider-heavy</th>
                  <td class="mdc-data-table__cell">Offline</td>
                  <td class="mdc-data-table__cell">Huge</td>
                  <td class="mdc-data-table__cell">Triaged</td>
                  <td class="mdc-data-table__cell mdc-data-table__cell--numeric">0:33</td>
                  <td class="mdc-data-table__cell">Brie Larson</td>
                </tr>
                <tr data-row-id="u2" class="mdc-data-table__row mdc-data-table__row--selected" aria-selected="true">
                  <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
                    <div class="mdc-checkbox mdc-data-table__row-checkbox mdc-checkbox--selected">
                      <input type="checkbox" class="mdc-checkbox__native-control" checked aria-labelledby="u2"/>
                      <div class="mdc-checkbox__background">
                        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                        </svg>
                        <div class="mdc-checkbox__mixedmark"></div>
                      </div>
                      <div class="mdc-checkbox__ripple"></div>
                    </div>
                  </td>
                  <th class="mdc-data-table__cell" scope="row" id="u2">monarch: prod shared ares-managed-features-provider-heavy</th>
                  <td class="mdc-data-table__cell">Online</td>
                  <td class="mdc-data-table__cell">Minor</td>
                  <td class="mdc-data-table__cell">Not triaged</td>
                  <td class="mdc-data-table__cell mdc-data-table__cell--numeric">0:33</td>
                  <td class="mdc-data-table__cell">Jeremy Lake</td>
                </tr>
                <tr data-row-id="u3" class="mdc-data-table__row">
                  <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
                    <div class="mdc-checkbox mdc-data-table__row-checkbox">
                      <input type="checkbox" class="mdc-checkbox__native-control" aria-labelledby="u3"/>
                      <div class="mdc-checkbox__background">
                        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                        </svg>
                        <div class="mdc-checkbox__mixedmark"></div>
                      </div>
                      <div class="mdc-checkbox__ripple"></div>
                    </div>
                  </td>
                  <th class="mdc-data-table__cell" scope="row" id="u3">Arcus watch slowdown</th>
                  <td class="mdc-data-table__cell">Online</td>
                  <td class="mdc-data-table__cell">Negligible</td>
                  <td class="mdc-data-table__cell">Triaged</td>
                  <td class="mdc-data-table__cell mdc-data-table__cell--numeric">0:33</td>
                  <td class="mdc-data-table__cell">Angelina Cheng</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Material Design Table 2 -->

        <!-- <div class="mdc-data-table2">
          <table class="mdc-data-table__table" aria-label="Dessert calories">
            <thead>
              <tr class="mdc-data-table__header-row">
                <th
                  class="
                    mdc-data-table__header-cell 
                    mdc-data-table__header-cell--with-sort"
                  role="columnheader"
                  scope="col"
                  aria-sort="none"
                  data-column-id="dessert"
                >
                  <div class="mdc-data-table__header-cell-wrapper">
                    <div class="mdc-data-table__header-cell-label">
                      Dessert
                    </div>
                    <button class="mdc-icon-button material-icons mdc-data-table__sort-icon-button"
                            aria-label="Sort by dessert" aria-describedby="dessert-status-label">arrow_upward</button>
                    <div class="mdc-data-table__sort-status-label" aria-hidden="true" id="dessert-status-label">
                    </div>
                  </div>
                </th>
                <th
                  class="
                    mdc-data-table__header-cell 
                    mdc-data-table__header-cell--numeric 
                    mdc-data-table__header-cell--with-sort 
                    mdc-data-table__header-cell"
                  role="columnheader"
                  scope="col"
                  aria-sort="none"
                  data-column-id="carbs"
                >
                  <div class="mdc-data-table__header-cell-wrapper">
                    <button class="mdc-icon-button material-icons mdc-data-table__sort-icon-button"
                            aria-label="Sort by carbs" aria-describedby="carbs-status-label">arrow_upward</button>
                    <div class="mdc-data-table__header-cell-label">
                      Carbs (g)
                    </div>
                    <div class="mdc-data-table__sort-status-label" aria-hidden="true" id="carbs-status-label"></div>
                  </div>
                </th>
                <th
                  class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric mdc-data-table__header-cell--with-sort"
                  role="columnheader"
                  scope="col"
                  aria-sort="none"
                  data-column-id="protein"
                >
                  <div class="mdc-data-table__header-cell-wrapper">
                    <button class="mdc-icon-button material-icons mdc-data-table__sort-icon-button"
                            aria-label="Sort by protein" aria-describedby="protein-status-label">arrow_upward</button>
                    <div class="mdc-data-table__header-cell-label">
                      Protein (g)
                    </div>
                    <div class="mdc-data-table__sort-status-label" aria-hidden="true" id="protein-status-label"></div>
                  </div>
                </th>
                <th
                  class="mdc-data-table__header-cell"
                  role="columnheader"
                  scope="col"
                  data-column-id="comments"
                >
                  Comments
                </th>
              </tr>
            </thead>
            <tbody class="mdc-data-table__content">
              <tr class="mdc-data-table__row">
                <td class="mdc-data-table__cell">Frozen yogurt</td>
                <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
                  34
                </td>
                <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
                  6.0
                </td>
                <td class="mdc-data-table__cell">Super tasty</td>
              </tr>
              <tr class="mdc-data-table__row">
                <td class="mdc-data-table__cell">Frozen Cheese</td>
                <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
                  24
                </td>
                <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
                  4.0
                </td>
                <td class="mdc-data-table__cell">Great on a Date</td>
              </tr>
              <tr class="mdc-data-table__row">
                <td class="mdc-data-table__cell">Icee Yellow</td>
                <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
                  84
                </td>
                <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
                  3.0
                </td>
                <td class="mdc-data-table__cell">Yummy good</td>
              </tr>
              <tr class="mdc-data-table__row">
                <td class="mdc-data-table__cell">Some Ice Cold Ice</td>
                <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
                  2
                </td>
                <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
                  1.0
                </td>
                <td class="mdc-data-table__cell">It is necessary for health</td>
              </tr>
              <tr class="mdc-data-table__row">
                <td class="mdc-data-table__cell">Fried Chicken Ice Cream</td>
                <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
                  20
                </td>
                <td class="mdc-data-table__cell mdc-data-table__cell--numeric">
                  12.0
                </td>
                <td class="mdc-data-table__cell">Its a meal and dessert</td>
              </tr>
            </tbody>
          </table>
        </div> -->

        <div class="mdc-data-table3"></div>

      </div>
    `
  }
}
customElements.define('page-myexamples', MyExamples);