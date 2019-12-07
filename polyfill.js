;(function() {
  if (typeof AnonymousElement !== 'function') {
    polyfill()
  }

  function polyfill() {
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

    AnonymousElement[isAnonymous] = true

    window.AnonymousElement = new Proxy(AnonymousElement, {
      construct: function(target, args, newTarget) {
        if (!isRegistered(newTarget)) {
          registerAnonymousElement(newTarget)
        }

        var instance = Reflect.construct(...arguments)

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
})()
