import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["display", "form", "input"]

  showInput() {
    this.displayTarget.classList.add("hidden")
    this.formTarget.classList.remove("hidden")
    this.inputTarget.focus()
  }

  hideInput() {
    this.displayTarget.classList.remove("hidden")
    this.formTarget.classList.add("hidden")
  }

  save(event) {
    event.preventDefault()
    const form = event.target

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        "Accept": "text/html, application/xhtml+xml",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      credentials: "same-origin"
    })
    .then(response => {
      if (response.ok) {
        return response.text()
      }
      throw new Error('Network response was not ok')
    })
    .then(html => {
      const frame = this.element.closest("turbo-frame")
      if (frame) {
        frame.innerHTML = html
      }
    })
    .catch(error => {
      console.error('Error:', error)
      this.hideInput()
    })
  }

  cancel(event) {
    event.preventDefault()
    this.hideInput()
  }

  handleKeydown(event) {
    if (event.key === "Escape") {
      this.cancel(event)
    }
  }

  handleBlur(event) {
    if (!this.formTarget.contains(event.relatedTarget)) {
      this.cancel(event)
    }
  }
} 