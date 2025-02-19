import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['display', 'form', 'input']

  showInput(event) {
    event.preventDefault()
    this.displayTarget.classList.add('hidden')
    this.formTarget.classList.remove('hidden')
    this.inputTarget.focus()
  }

  cancel(event) {
    event.preventDefault()
    this.formTarget.classList.add('hidden')
    this.displayTarget.classList.remove('hidden')
    this.inputTarget.value = this.inputTarget.defaultValue
  }

  handleKeydown(event) {
    if (event.key === 'Escape') {
      this.cancel(event)
    }
  }

  handleBlur(event) {
    // Optional: auto-save on blur
    // this.element.requestSubmit()
  }
}
