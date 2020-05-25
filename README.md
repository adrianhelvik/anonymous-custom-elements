# Proposal: Anonymous custom elements
This proposal adds the new class `AnonymousElement`. This
class can be extended to create anonymous custom elements.

```javascript
class MyAnonymousElement extends AnonymousElement {
  connectedCallback() {
    this.textContent = 'I am anonymous'
  }
}

document.body.appendChild(new MyAnonymousElement())
```

## AnonymousElement specification
AnonymousElement extends HTMLElement and inherits all
properties not mentioned in this proposal.

### tagName
Readonly property containing an empty `DOMString`.

### outerHTML
Returns the same value as innerHTML.

## Polyfill usage
*WARNING: Do not use in production.*

```html
<!doctype html>
<meta charset="utf-8">
<body>
  <script src="http://cdn.jsdelivr.net/gh/adrianhelvik/anonymous-custom-elements/polyfill.js"></script>
  <script>
    class MyAnonymousElement extends AnonymousElement {
      connectedCallback() {
        this.textContent = 'I am anonymous'
      }
    }

    document.body.appendChild(new MyAnonymousElement())
  </script>
</body>
```

[Live example](https://rawcdn.githack.com/adrianhelvik/anonymous-custom-elements/495bac1115864b441eb9fe103c8c05f1155e9338/example.html)


## Polyfill constraints
Does not alter `innerHTML`, `outerHTML` or `tagName`
