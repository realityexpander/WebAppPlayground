import { html } from 'lit';
import { component, useState } from 'haunted'

/** 
  Haunted lets you use React components in lit.

  Haunted supports the same API as React Hooks. 
  The hope is that by doing so you can reuse hooks available on npm simply by aliasing package names in your bundler's config.

  Currently Haunted supports the following hooks:

  useCallback
  useContext
  useController
  useEffect
  useLayoutEffect
  useMemo
  useReducer
  useRef
  useState
**/

function Counter() {
  const [count, setCount] = useState(0);

  const style = `
    button {
      padding: 0.65rem 1.0rem;
      margin: 0.25rem;
      border: 1px solid #ccc;
      border-radius: 0.25rem;
      background-color: #fff;
      cursor: pointer;
    }
    button:hover {
      background-color: #eee;
    }
  `

  return html`
    <style>
      ${style}
    </style>

    <div 
      part="count">
      Count: ${count}
      <button part="button" @click=${() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  `;
}

customElements.define('my-counter', component(Counter));