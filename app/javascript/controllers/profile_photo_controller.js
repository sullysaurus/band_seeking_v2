import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="profile-photo"
export default class extends Controller {
  static targets = ["input", "preview"]

  connect() {
    const container = this.element.querySelector('.group')
    if (container) {
      container.addEventListener('click', () => {
        this.inputTarget.click()
      })
    }
  }

  previewImage(event) {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        if (this.hasPreviewTarget) {
          if (this.previewTarget.tagName === 'IMG') {
            this.previewTarget.src = e.target.result
          } else {
            // Replace the div with an img element
            const img = document.createElement('img')
            img.src = e.target.result
            img.className = 'w-full h-full object-cover'
            img.dataset.profilePhotoTarget = 'preview'
            this.previewTarget.replaceWith(img)
          }
        }
      }

      reader.readAsDataURL(file)
      
      // Create FormData and submit
      const form = this.element
      const formData = new FormData(form)
      
      fetch(form.action, {
        method: 'PATCH',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        credentials: 'same-origin'
      })
    }
  }
} 