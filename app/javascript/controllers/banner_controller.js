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
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewTarget.src = e.target.result
      }
      reader.readAsDataURL(file)

      const form = this.element.closest('form')
      if (form) form.requestSubmit()
    }
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
