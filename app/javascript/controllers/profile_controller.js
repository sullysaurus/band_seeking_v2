import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="profile"
export default class extends Controller {
  static targets = ["display", "form"]

  toggleEdit(event) {
    event.preventDefault();
    let section = event.currentTarget.dataset.section;
    this.element.querySelector(`[data-profile-display="${section}"]`).classList.toggle("hidden");
    this.element.querySelector(`[data-profile-form="${section}"]`).classList.toggle("hidden");
  }

  previewImage(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = this.element.querySelector(`[data-profile-preview="${event.target.dataset.section}"]`);
        if (preview) {
          preview.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.closest("form").submit();
  }
}
