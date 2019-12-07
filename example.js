import './index.js'

document.body.style.fontFamily = 'sans-serif'

class MyAnonymousElement extends AnonymousElement {
  connectedCallback() {
    Object.assign(this.style, {
      background: 'lightgreen',
      padding: '20px',
      display: 'block',
    })

    this.textContent = 'Created anonymous element'
  }
}

class CanNotBeAnonymous extends HTMLElement {
  connectedCallback() {
    this.textContent = 'SHOULD NOT HAPPEN'
  }
}

class CanNotBeDefined extends AnonymousElement {
  connectedCallback() {
    if (this.tagName === 'foo-bar') {
      this.textContent = 'SHOULD NOT HAPPEN'
    }
  }
}

try {
  const outer = document.createElement('div')
  document.body.appendChild(outer)
  outer.appendChild(new MyAnonymousElement())
  try {
    outer.appendChild(new CanNotBeAnonymous())
  } catch (e) {}
  customElements.define('foo-bar', CanNotBeDefined)
  outer.appendChild(new CanNotBeDefined())
} catch (e) {
  const div = document.createElement('div')
  Object.assign(div.style, {
    background: 'red',
    whiteSpace: 'pre-wrap',
    padding: '20px',
  })
  div.textContent = e.stack
  document.body.appendChild(div)
}
