import polyfill from './polyfill.js'

polyfill({ completePolyfill: true })

document.body.style.fontFamily = 'sans-serif'

class MyAnonymousElement extends AnonymousElement {
  connectedCallback() {
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
    } else {
      this.textContent = '. And it went okay!'
    }
  }
}

try {
  const outer = document.createElement('div')
  Object.assign(outer.style, {
    background: 'lightgreen',
    padding: '20px',
    display: 'block',
  })
  document.body.appendChild(outer)
  var anonymousElement = new MyAnonymousElement()
  outer.appendChild(anonymousElement)
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

const code = document.createElement('pre')

code.textContent = `
-------------------------------------
------ document.body.innerHTML ------
-------------------------------------

${document.body.innerHTML}

-------------------------------------
------ document.body.outerHTML ------
-------------------------------------

${document.body.outerHTML}

----------------------------------------
------ anonymousElement.outerHTML ------
----------------------------------------

${anonymousElement.outerHTML}
`

document.body.appendChild(code)
