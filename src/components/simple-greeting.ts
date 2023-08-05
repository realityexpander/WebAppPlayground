import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

// Context
import { createContext } from '@lit-labs/context';
import { provide } from '@lit-labs/context';
import { consume } from '@lit-labs/context';

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

export const fooContext = createContext<Foo>('foo');

@customElement('root-element')
export class RootElement extends LitElement {
  static styles = css`p { color: blue }`;

  @property()
  name = 'Root';

  @provide({context: fooContext}) 
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
    this.foo = {foo: 'fooChangedBack💿💿'};
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

  @consume({context: fooContext, subscribe: true}) 
  foo!: Foo;

  render() {
    return html`
      <p>Child: ${this.name} ${this.foo.foo}</p>
      <button @click=${() => {
        let newFoo = {foo:'fooChangedBack'}
        document.dispatchEvent(new CustomEvent('foo-changed', {detail: newFoo}))  // sends to document
      }}>
        Change FooBack
      </button>
    `;
  }
}