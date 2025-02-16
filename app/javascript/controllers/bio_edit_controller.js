import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["display", "form", "input"]

  showInput(event) {
    event.preventDefault()
    this.displayTarget.classList.add("hidden")
    this.formTarget.classList.remove("hidden")
    this.inputTarget.focus()
  }

  save(event) {
    // Let the form submit normally with Turbo
    // The form has turbo_frame data attribute which will handle the update
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
    // Only hide if we're not clicking within the form
    if (!this.formTarget.contains(event.relatedTarget)) {
      this.cancel(event)
    }
  }
} 