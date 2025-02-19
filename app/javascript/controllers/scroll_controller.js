import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['container']

  connect() {
    this.setupScrollObserver()
  }

  setupScrollObserver() {
    // Create a MutationObserver to watch for new messages
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          this.scrollToBottom()
        }
      })
    })

    // Start observing the container for changes
    this.observer.observe(this.containerTarget, {
      childList: true, // Watch for added/removed nodes
      subtree: true // Watch all descendants
    })

    // Initial scroll
    this.scrollToBottom()
  }

  scrollToBottom() {
    const container = this.containerTarget
    container.scrollTop = container.scrollHeight
  }

  disconnect() {
    // Clean up the observer when the controller is disconnected
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}
