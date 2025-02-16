import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["display", "form", "input"]

  showForm(event) {
    event.preventDefault()
    this.displayTarget.classList.add("hidden")
    this.formTarget.classList.remove("hidden")
    this.inputTarget.focus()
  }

  cancel(event) {
    event.preventDefault()
    this.formTarget.classList.add("hidden")
    this.displayTarget.classList.remove("hidden")
    this.inputTarget.value = this.inputTarget.defaultValue
  }

  handleKeydown(event) {
    if (event.key === "Escape") {
      this.cancel(event)
    }
  }

  handleBlur(event) {
    // Optional: auto-save on blur
    // this.element.requestSubmit()
  }

  save(event) {
    event.preventDefault()
    const formData = new FormData(event.target)

    fetch(event.target.action, {
      method: 'PATCH',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'X-CSRF-Token': document.querySelector("[name='csrf-token']").content
      },
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
      if (data.display_name) {
        this.displayTarget.textContent = data.display_name
        this.hideForm()
      }
    })
    .catch(error => console.error('Error:', error))
  }
} 