import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["display", "form", "input"]

  showInput(event) {
    this.displayTarget.classList.add("hidden")
    this.formTarget.classList.remove("hidden")
    this.inputTarget.value = this.displayTarget.textContent.trim()
    this.inputTarget.focus()
  }

  cancel(event) {
    event.preventDefault()
    this.hideForm()
  }

  handleKeydown(event) {
    if (event.key === "Escape") {
      this.hideForm()
    }
  }

  handleBlur(event) {
    const relatedTarget = event.relatedTarget
    if (relatedTarget && this.formTarget.contains(relatedTarget)) {
      return
    }
  }

  hideForm() {
    this.formTarget.classList.add("hidden")
    this.displayTarget.classList.remove("hidden")
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
      if (data.bio) {
        this.displayTarget.textContent = data.bio
        this.hideForm()
      }
    })
    .catch(error => console.error('Error:', error))
  }
} 