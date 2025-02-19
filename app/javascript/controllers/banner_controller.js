import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['input', 'preview']

  connect() {
    console.log('Banner controller connected')
  }

  triggerFileInput() {
    this.inputTarget.click()
  }

  updateBanner(event) {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      if (this.hasPreviewTarget) {
        if (this.previewTarget.tagName === 'IMG') {
          this.previewTarget.src = e.target.result
        } else {
          const img = document.createElement('img')
          img.src = e.target.result
          img.className = 'w-full h-[200px] object-cover rounded-lg shadow-md'
          img.dataset.bannerTarget = 'preview'
          this.previewTarget.replaceWith(img)
        }
      }
    }
    reader.readAsDataURL(file)

    // Submit form directly
    const formData = new FormData(this.element)
    fetch(this.element.action, {
      method: 'PATCH',
      body: formData,
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      credentials: 'same-origin'
    })
  }

  initializeUpload(event) {
    const { controller } = event.detail
    console.log('Starting upload')

    this.previewTarget.classList.add('opacity-50')

    controller.upload
      .then(() => {
        console.log('Upload complete, submitting form')
        this.previewTarget.classList.remove('opacity-50')
        this.element.requestSubmit()
      })
      .catch((error) => {
        console.error('Upload failed:', error)
        this.previewTarget.classList.remove('opacity-50')
      })
  }
}
