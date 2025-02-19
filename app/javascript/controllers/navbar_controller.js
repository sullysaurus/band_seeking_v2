import { Controller } from '@hotwired/stimulus'

// Connects to data-controller="navbar"
export default class extends Controller {
  static targets = ['menu', 'mobileMenu']

  connect() {
    // Close menu when clicking outside
    document.addEventListener('click', this.closeMenuOutside.bind(this))
    document.addEventListener('turbo:visit', this.closeMobileMenu.bind(this))
  }

  disconnect() {
    document.removeEventListener('click', this.closeMenuOutside.bind(this))
    document.removeEventListener('turbo:visit', this.closeMobileMenu.bind(this))
  }

  toggleMobile(event) {
    event.stopPropagation()
    this.mobileMenuTarget.classList.toggle('hidden')
  }

  closeMenuOutside(event) {
    if (!this.element.contains(event.target)) {
      this.mobileMenuTarget.classList.add('hidden')
    }
  }

  closeMobileMenu() {
    this.mobileMenuTarget.classList.add('hidden')
  }
}
