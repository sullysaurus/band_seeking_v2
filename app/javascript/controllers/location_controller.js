import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['display', 'form', 'input']

  connect() {
    this.handleFrameLoad = this.handleFrameLoad.bind(this)
    document.addEventListener('turbo:frame-load', this.handleFrameLoad)
  }

  handleFrameLoad(event) {
    if (event.target.id === 'location_frame') {
      this.formTarget.classList.add('hidden')
      this.displayTarget.classList.remove('hidden')
    }
  }

  showEdit(event) {
    event.preventDefault()
    this.displayTarget.classList.add('hidden')
    this.formTarget.classList.remove('hidden')
    this.inputTarget.focus()
  }

  hideForm() {
    this.formTarget.classList.add('hidden')
    this.displayTarget.classList.remove('hidden')
  }

  cancel(event) {
    event.preventDefault()
    this.hideForm()
    this.inputTarget.value = this.inputTarget.defaultValue
  }

  handleKeydown(event) {
    if (event.key === 'Escape') {
      this.cancel(event)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      event.target.form.requestSubmit()
    }
  }

  disconnect() {
    document.removeEventListener('turbo:frame-load', this.handleFrameLoad)
  }
}
