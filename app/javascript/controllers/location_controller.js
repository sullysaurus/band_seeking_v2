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

  showEdit() {
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

  disconnect() {
    document.removeEventListener('turbo:frame-load', this.handleFrameLoad)
  }
}
