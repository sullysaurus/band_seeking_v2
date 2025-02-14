import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="banner-upload"
export default class extends Controller {
  static targets = ["input"]

  triggerFileInput(event) {
    event.preventDefault()
    this.inputTarget.click()
  }

  updateBanner(event) {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        // Update the preview image if available
        const previewImage = this.element.querySelector("img")
        if (previewImage) {
          previewImage.src = e.target.result
        }
      }
      reader.readAsDataURL(file)
    }
    // Submit the form via Turbo so only the banner frame is updated
    this.element.requestSubmit()
  }
}