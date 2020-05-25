export default function polyfill({ completePolyfill }) {
  if (typeof window.AnonymousElement === 'function') return

  var anonymousElements = new WeakMap()
  var isAnonymous = Symbol('isAnonymous')
  var allowAnonDef = false
  var usedNames = {}

  var defineElement = window.customElements.define

  window.customElements.define = function(...args) {
    const name = args[0]
    const type = args[1]

    if (!allowAnonDef && type[isAnonymous]) return

    return defineElement.apply(window.customElements, args)
  }

  class AnonymousElement extends HTMLElement {}

  if (completePolyfill) {
    const innerHTML = Object.getOwnPropertyDescriptor(
      Element.prototype,
      'innerHTML',
    )

    const outerHTML = Object.getOwnPropertyDescriptor(
      Element.prototype,
      'outerHTML',
    )

    Object.defineProperty(Element.prototype, 'innerHTML', {
      get() {
        if (this.childNodes) {
          const result = []
          for (let i = 0; i < this.childNodes.length; i++) {
            if (this.childNodes[i] instanceof Text) {
              result.push(this.childNodes[i].textContent)
            } else if (this.childNodes[i] instanceof Comment) {
              result.push(`<!--${this.childNodes[i].textContent}-->`)
            } else {
              result.push(this.childNodes[i].outerHTML)
            }
          }
          return result.join('')
        }
        return innerHTML.get.call(this)
      },
      set() {
        return innerHTML.set.call(this)
      },
    })

    Object.defineProperty(Element.prototype, 'outerHTML', {
      get() {
        if (this.childNodes) {
          const result = []
          for (let i = 0; i < this.childNodes.length; i++) {
            if (this.childNodes[i] instanceof Text) {
              result.push(this.childNodes[i].textContent)
            } else if (this.childNodes[i] instanceof Comment) {
              result.push(`<!--${this.childNodes[i].textContent}-->`)
            } else {
              result.push(this.childNodes[i].outerHTML)
            }
          }
          if (this instanceof AnonymousElement) {
            return result.join('')
          }
          const tagName = this.tagName.toLowerCase()

          let attrs = []

          for (let i = 0; i < this.attributes.length; i++) {
            attrs.push(
              `${this.attributes[i].name}="${this.attributes[i].value}"`,
            )
          }

          attrs = attrs.length ? ' ' + attrs.join(' ') : ''

          return `<${tagName}${attrs}>${result.join('')}</${tagName}>`
        }
        return outerHTML.get.call(this)
      },
      set() {
        return outerHTML.set.call(this)
      },
    })
  }

  AnonymousElement[isAnonymous] = true

  window.AnonymousElement = new Proxy(AnonymousElement, {
    construct: function(target, args, newTarget) {
      if (!isRegistered(newTarget)) {
        registerAnonymousElement(newTarget)
      }

      var instance = Reflect.construct(...arguments)

      instance.style.display = 'contents !important'

      return instance
    },
  })

  function generateRandomName(Component) {
    var baseName = decamelize(Component.name)
    var suffix = randomString()

    if (!/[a-z\-]+/.test(baseName)) {
      return `${suffix}---anonymous`
    }

    return `${baseName}---anonymous-${suffix}`
  }

  function decamelize(string) {
    var letters = string.split('')
    var result = []

    letters.forEach(function(letter) {
      var lowerCased = letter.toLowerCase()

      if (lowerCased !== letter) {
        result.push('-', letter.toLowerCase())
      } else {
        result.push(letter)
      }
    })

    while (result[0] === '-') {
      result.shift()
    }

    return result.join('')
  }

  function randomString() {
    return Math.random()
      .toString(36)
      .slice(2)
      .replace(/[^a-z]/g, '')
  }

  function isRegistered(CustomElement) {
    return anonymousElements.has(CustomElement)
  }

  function registerAnonymousElement(CustomElement) {
    var name = generateRandomName(CustomElement)
    usedNames[name] = true
    allowAnonDef = true
    try {
      customElements.define(name, CustomElement)
    } finally {
      allowAnonDef = false
    }
    anonymousElements.set(CustomElement, name)
  }
}
