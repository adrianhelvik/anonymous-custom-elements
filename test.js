import polyfill from './polyfill'

polyfill({
  completePolyfill: true,
})

beforeEach(() => {
  document.body.innerHTML = ''
  global.root = document.createElement('div')
  document.body.appendChild(root)
})

it('can be created', () => {
  class Foo extends AnonymousElement {}

  root.appendChild(new Foo())

  expect(root.childNodes[0] instanceof Foo)
})

it('calls createdCallback (like any other custom element)', () => {
  let connected = false

  class Foo extends AnonymousElement {
    connectedCallback() {
      connected = true
    }
  }

  root.appendChild(new Foo())

  expect(connected).toBe(true)
})

test('.innerHTML === .outerHTML', () => {
  class Foo extends AnonymousElement {
    connectedCallback() {
      this.textContent = 'Hello world'
    }
  }

  root.appendChild(new Foo())

  expect(root.childNodes[0].innerHTML).toBe('Hello world')
  expect(root.childNodes[0].outerHTML).toBe('Hello world')
})

test('parent.innerHTML', () => {
  class Foo extends AnonymousElement {
    connectedCallback() {
      this.textContent = 'Hello world'
    }
  }

  const parent = document.createElement('h1')

  parent.appendChild(new Foo())
  root.appendChild(parent)

  expect(root.innerHTML).toBe('<h1>Hello world</h1>')
})
