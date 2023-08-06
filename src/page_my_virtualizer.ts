import { LitElement, html } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';
import { customElement, property, query } from 'lit/decorators.js';

import { LitVirtualizer } from '@lit-labs/virtualizer';
import { virtualize, virtualizerRef } from '@lit-labs/virtualizer/virtualize.js';
import { flow } from '@lit-labs/virtualizer/layouts/flow.js';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';
import { masonry } from '@lit-labs/virtualizer/layouts/masonry.js';
import { repeat } from 'lit/directives/repeat.js';
import './components/my-virtualizer.js';

@customElement('page-my-virtualizer')  // ts
class PageMyVirtualizer extends LitElement {

  static styles = styles;

  firstUpdated() {
  }

  @query('ul')  // gets a reference to the <ul> element in the template
  list: HTMLUListElement | undefined;
  data: {text: string}[] = new Array(100).fill('').map((i, n) => ({text: `Item ${n}`}));

  render() {
    return html`
      <div class="wrapper">
        <style>
          img {
            /* rounded corners */
            border-radius: 15px;
            /* add a shadow */
            box-shadow: 0 0 10px rgba(1, 1, 1, 0.7);
            margin-bottom: 5px;
          }
        </style>
        
        <h1>This is the page for MyVirtualizer</h1>
        <h3>Should be called "FastList", "LitList" or "QuickList"</h3>
        <br>
        <br>
        <h3>@lit-labs/virtualizer</h3>
        <a href="https://www.youtube.com/watch?v=ay8ImAgO9ik" target="_blank">Lit Labs Virtualizer</a><br> 
        <a href="https://codesandbox.io/s/litelement-typescript-litvirtualizer-sxjsww?file=/src/x-row-scroller.ts" target="_blank">Horizontal Scroller</a>
        <!-- <my-virtualizer bookId="UUID2:Role.Book@00000000-0000-0000-0000-000000001200"></my-virtualizer> -->
        <br>
        <br>

        <!-- This is the original naive version that will bog-down rendering performance any browser -->
        <!-- 
          ${repeat(
            Array.from({ length: 1000 }, (_, i) => i),
              (item) => html`<img src="https://picsum.photos/seed/${item + 1}/200/300.jpg" />`
          )} 
        -->
      

        <!-- simple example -->
        <!--
        <img src="https://picsum.photos/seed/1/200/300.jpg" />
        <lit-virtualizer
          scroller
          .items=${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          .renderItem=${(item: any) => html`<p>hello ${item}</p>`}
          ></lit-virtualizer>
        <br>
        -->

        <!-- <my-virtualizer bookId="UUID2:Role.Book@00000000-0000-0000-0000-000000009999"></my-virtualizer> -->
        
        <!-- for the standard lit-virtualized element -->
        <button 
          @click=${() => {
            // this.shadowRoot?.querySelector("#virtualizer") // js
            (this.shadowRoot?.querySelector("#virtualizer1") as LitVirtualizer) // ts
              .element(30)
              ?.scrollIntoView()
          }}>Scroll to Element 30 
        </button>
        <br>
        <br>
        <!-- This is using the virtualizer element -->
        <!-- Can also use direction: 'horizontal' -->
        <!-- Can also use direction: 'vertical' -->
        <!-- scroller makes the element a viewport-->
        <!-- .layout=${flow({ direction: 'vertical' })}  -->
        <lit-virtualizer id="virtualizer1" 
          scroller style="height: 350px; width: 100%; overflow: auto;"
          .items=${Array.from({ length: 1000 }, (_, i) => i)}
          .renderItem=${(item: number) => 
            html`
            <div>
              <img src="https://picsum.photos/seed/${item + 1}/200/300.jpg" />
              <p>${item}</p>
            </div>`
          }
        ></lit-virtualizer>
        <br>


        <!-- This is using the virtualize function & the scrollToListItem -->
        <!-- for the virtualized <ul> element -->
        <button 
          @click=${() => { this.scrollToListItem(30); }}
          >Scroll to Element 30 in &lt;ul&gt;
        </button>
        <br>
        <div id="virtualizer2">
          <ul>
          ${virtualize({
            items: this.data,
            renderItem: (i) => html`<li>${i.text}</li>`,
          })}
          </ul>
        </div> 

        <!-- This is using the virtualize function & grid layout (2 columns only right now :( ) -->
        <!-- 
        <div id="virtualizer3">
          ${virtualize({
            items: Array.from({ length: 1000 }, (_, i) => i),
            renderItem: item => html`<img src="https://picsum.photos/seed/${item + 1}/200/300.jpg" />`,
            layout: grid(),
          })}
        </div> 
        -->

        </div>
    `
  }

  // Uses the reference to the <ul> element in the template.
  // For use with id=virtualizer3.
  scrollToListItem(idx: number) {
    (this.list as any)[virtualizerRef]
      .element(idx)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
// customElements.define('page-my-virtualizer', PageMyVirtualizer);  // js
