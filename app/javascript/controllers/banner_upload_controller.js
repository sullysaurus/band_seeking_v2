import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input"]

  triggerFileInput(event) {
    event.preventDefault()
    this.inputTarget.click()
  }

  updateBanner(event) {
    const file = event.target.files[0]
    if (file) {
      const form = event.target.closest('form')
      const formData = new FormData(form)
      
      fetch(form.action, {
        method: 'PATCH',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector("[name='csrf-token']").content
        },
        credentials: 'same-origin'
      })
      .then(response => {
        if (response.ok) {
          window.location.reload()
        }
      })
      .catch(error => console.error('Error:', error))
    }
  }
}