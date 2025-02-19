import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['tag', 'input', 'form']

  connect() {
    // Initialize hidden inputs based on active tags
    this.updateInputs()
  }

  toggle(event) {
    event.preventDefault()
    const button = event.currentTarget

    // Toggle active state
    if (button.classList.contains('bg-blue-500')) {
      button.classList.remove('bg-blue-500', 'text-white')
      button.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200')
    } else {
      button.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200')
      button.classList.add('bg-blue-500', 'text-white')
    }

    // Update hidden inputs and submit form
    this.updateInputs()

    // Submit form with fetch to prevent page reload
    this.submitForm()
  }

  toggleSingle(event) {
    event.preventDefault()
    const button = event.currentTarget

    // Remove active state from all buttons
    this.tagTargets.forEach((tag) => {
      tag.classList.remove('bg-blue-500', 'text-white')
      tag.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200')
    })

    // Add active state to clicked button
    button.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200')
    button.classList.add('bg-blue-500', 'text-white')

    // Update input value
    this.inputTarget.value = button.dataset.value

    this.submitForm()
  }

  submitForm() {
    const formData = new FormData(this.formTarget)
    fetch(this.formTarget.action, {
      method: 'PATCH',
      body: formData,
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': document.querySelector("[name='csrf-token']").content
      },
      credentials: 'same-origin'
    })
  }

  updateInputs() {
    if (this.inputTarget.multiple) {
      // Handle multiple selections (arrays)
      while (this.inputTarget.nextElementSibling) {
        this.inputTarget.nextElementSibling.remove()
      }

      this.tagTargets.forEach((tag) => {
        if (tag.classList.contains('bg-blue-500')) {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = `${this.inputTarget.name}`
          input.value = tag.dataset.value
          this.inputTarget.after(input)
        }
      })
    } else {
      // Handle single selection
      const activeTag = this.tagTargets.find((tag) => tag.classList.contains('bg-blue-500'))
      this.inputTarget.value = activeTag ? activeTag.dataset.value : ''
    }
  }
}
