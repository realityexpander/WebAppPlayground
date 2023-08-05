import {html, css, LitElement, PropertyValueMap} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

// Context
import { createContext } from '@lit-labs/context';
import { provide } from '@lit-labs/context';
import { consume } from '@lit-labs/context';

// Task
import {Task, TaskStatus} from '@lit-labs/task';
import { authService } from "../authenticationService";


@customElement('simple-greeting')
export class SimpleGreeting extends LitElement {
  static styles = css`p { color: blue }`;

  @property()
  name = 'Somebody';

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}

type Foo = {
  foo: string;
}

export const fooContext = createContext<Foo>('foo'); // Create a context for Foo Single Source of truth

@customElement('root-element')
export class RootElement extends LitElement {
  static styles = css`p { color: blue }`;

  @property()
  name = 'Root';

  @provide({context: fooContext}) // Single Source of truth for Foo
  foo: Foo = {foo: 'fooInit'};

  render() {
    return html`
      <p>Root: ${this.name} ${this.foo}</p>
      <button @click=${() => this.foo = {foo:'fooChanged'}}>Change Foo</button>
      <br>
      <parent-element name=${this.name}></parent-element>
    `;
  }

  // listen for changes to foo
  fooChanged(event: Event) {
    console.log('foo changed', event);
    // this.foo = (event as CustomEvent).detail;
    this.foo = {foo: 'fooChangedBack💿💿'}; // Update the Single Source of truth
  }

  firstUpdated() {
    document.addEventListener('foo-changed', this.fooChanged.bind(this));
  }
}

@customElement('parent-element')
export class ParentElement extends LitElement {
  static styles = css`p { color: blue }`;

  @property()
  name = 'parent';

  render() {
    return html`
      <p>Parent: ${this.name}
      <br> 
      <child-element name=${this.name}></child-element></p>
    `;
  }
}

@customElement('child-element')
export class ChildElement extends LitElement {
  static styles = css`p { color: blue }`;

  @property()
  name = 'child';

  @consume({context: fooContext, subscribe: true}) // subscribe to changes from Single Source of truth
  foo!: Foo;

  render() {
    return html`
      <p>Child: ${this.name} ${this.foo.foo}</p>
      <button @click=${() => {
        let newFoo = {foo:'fooChangedBack'}
        document.dispatchEvent(new CustomEvent('foo-changed', {detail: newFoo}))  // send to document
      }}>
        Change FooBack
      </button>
    `;
  }
}

// Lit Youtube Video - https://www.youtube.com/watch?v=niWKuGhyE0M
@customElement('task-element')
class TaskElement extends LitElement {
  @property()
  private bookId: string  = ""; // "UUID2:Role.Book@00000000-0000-0000-0000-000000001100"

  private clientIpAddress: string | null;
  private authenticationToken: string | null;

  // @property({ type: Boolean }) // exists(true) or not(false), value is not used
  // private autoRun: Boolean = false
  
  // @property()
  // private autoRun: Boolean = false;  // note: even if type is Boolean, it type be a string "true" or "false" bc property decorator type-definition is not used

  constructor() {
    super();
    this.clientIpAddress = authService.getClientIpAddress();
    this.authenticationToken = authService.getAuthenticationToken();
  }

  private _apiTask = new Task(
    this,
    {
      task: async ([bookId]) => {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Forwarded-For', this.clientIpAddress ?? '');
        headers.append('Authorization', 'Bearer ' + this.authenticationToken ?? '');
        // Note: "mode: 'no-cors'" is not needed if the server is setup to allow CORS. 
        // If using "mode: 'no-cors'", the response will be opaque and the `response.ok` will be false 
        // but the `response.status` will be 200. The response will not be able to be parsed as JSON.
        // The request will still be sent to the server, but the response will not be returned to the client.
        // mode: 'no-cors', 

        let request = new Request(
          `http://localhost:8081/libraryApi/fetchBookInfo/${bookId}`, {
            method: 'GET',
            headers: headers
            // body: JSON.stringify(todo), // for POSTs/PUTs
          }
        );

        const response: Response = await fetch(request)
        if (!response.ok) {
          let error = await response.text()
          let errorOptions: ErrorOptions = {
            cause: {
              status: response.status,
              statusText: response.statusText,
              url: response.url,
            }
          }
          throw new Error(error, errorOptions)
        }

        return response.json()
      },
      args: () => [this.bookId],
      autoRun: true,  // true = run the task automatically when the `args` change
      // autoRun: false,  // false = manually `run` the task (ignores the `args` change)
    }
  );

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties);
    // this._apiTask.run(); // Run the task manually
  }

  render() {
    return html`
      <div>Book Info: ${this.bookId}</div>
      ${this._apiTask.render({
        // initial: () => html`<div>Initializing...</div>`, // Placeholder while the task is initializing
        initial: () => html`
          <button @click=${() => this._apiTask.run()}>Load</button>` // only shown when `autoRun` is false
        ,
        pending: () => html`Loading user info...`,
        complete: (data) => html`
          <pre>${JSON.stringify(data, null, 2)}</pre>`
        ,
        error: (e) => html`
          <p style="color: red;">Error loading info</p>
          error cause: <pre>${JSON.stringify((e as Error).cause, null, 2)}</pre>
          error message: <pre>${(e as Error).message}</pre>`
        ,
      })}
    `;
  }
}

@customElement('attr-test')
class AttrTest extends LitElement {
  @property({attribute: true})
  private someId: string  = ""; // "1100"

  @property({attribute: false})  // will not update the variable when the attribute changes
  private someId2: string  = ""; // "1200"

  @property({ type: Number, reflect: true })
  private someId3: number  = 0; // "1300"

  @property()
  private srcObject: Number | null = null;

  @property()
  prop4: String

  @property()
  prop3: Boolean

  constructor() {
    super();
    this.prop4 = 'pie';
    this.prop3 = true;
  }

  render() {
    return html`
      <div>someId: ${this.someId}</div>
      <div>someId attribute: ${this.getAttribute('someId')}</div>
      <div>someId2: ${this.someId2}</div>  <!-- will be empty -->
      <div>someId2 attribute: ${this.getAttribute('someId2')}</div>  <!-- will NOT be empty -->
      <div>someId3: ${this.someId3}</div> <!-- will NOT be empty -->
      <div>someId3 attribute: ${this.getAttribute('someId3')}</div> <!-- will NOT be empty -->
      <div>srcObject: ${this.srcObject}</div>

      <!-- property binding -->
      <div>
        property binding
        <input type="text" .value="${this.prop4}" @input="${(e: any) => this.prop4 = e.target.value}">
      </div>
      <p>${this.prop4}</p>

      <!-- boolean attribute binding -->
      <div>
        boolean attribute binding
        <input type="text" ?disabled="${this.prop3}"/>
      </div>
    `;
  }
}