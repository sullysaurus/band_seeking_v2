import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['input', 'preview']

  triggerFileInput(event) {
    this.inputTarget.click()
  }

  updateBanner(event) {
    const file = event.target.files[0]
    if (!file) return

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      if (this.previewTarget.tagName === 'IMG') {
        this.previewTarget.src = e.target.result
      } else {
        // Create new image element if preview is currently a div
        const img = document.createElement('img')
        img.src = e.target.result
        img.className = 'w-full h-[200px] object-cover rounded-lg shadow-md'
        img.dataset.bannerTarget = 'preview'
        this.previewTarget.parentNode.replaceChild(img, this.previewTarget)
      }
    }
    reader.readAsDataURL(file)
  }

  initializeUpload(event) {
    // Let direct upload complete before submitting the form
    event.detail.controller.upload.then(() => {
      this.element.requestSubmit()
    })
  }
}
