import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="profile-photo"
export default class extends Controller {
  static targets = ["input", "preview"]

  connect() {
    const container = this.previewTarget.closest('.group')
    container.addEventListener('click', () => {
      this.inputTarget.click()
    })
  }

  previewImage(event) {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (this.previewTarget.tagName === 'IMG') {
          this.previewTarget.src = e.target.result
        } else {
          // Create new image element and replace the div
          const img = document.createElement('img')
          img.src = e.target.result
          img.className = "w-full h-full object-cover"
          img.dataset.profilePhotoTarget = "preview"
          this.previewTarget.parentNode.replaceChild(img, this.previewTarget)
          this.previewTarget = img
        }
      }
      reader.readAsDataURL(file)
    }
    this.element.submit()
  }
} 