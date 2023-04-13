import { html, component, useState } from 'https://cdn.pika.dev/haunted';

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