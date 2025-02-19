import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['display', 'form', 'input']

  connect() {
    // Bind the handler so we can remove it later
    this.handleFrameLoad = this.handleFrameLoad.bind(this)
    document.addEventListener('turbo:frame-load', this.handleFrameLoad)
  }

  handleFrameLoad(event) {
    if (event.target.id === 'bio_frame') {
      this.formTarget.classList.add('hidden')
      this.displayTarget.classList.remove('hidden')
    }
  }

  showInput(event) {
    event.preventDefault()
    this.displayTarget.classList.add('hidden')
    this.formTarget.classList.remove('hidden')
    this.inputTarget.focus()
  }

  save(event) {
    // Don't hide form immediately - wait for Turbo
    // Form will be hidden when the frame updates
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
    // Only hide if we're not clicking within the form
    if (!this.formTarget.contains(event.relatedTarget)) {
      this.cancel(event)
    }
  }

  disconnect() {
    // Clean up event listener when controller is disconnected
    document.removeEventListener('turbo:frame-load', this.handleFrameLoad)
  }
}
