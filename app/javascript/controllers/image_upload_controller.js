import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="image-upload"
export default class extends Controller {
  static targets = ["input", "preview"]

  previewImage(event) {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewTarget.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
    this.element.submit()
  }
}
