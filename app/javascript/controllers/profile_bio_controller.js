import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["display", "form", "input"]

  showInput() {
    console.log("profile_bio_controller: Showing input form");

    this.displayTarget.classList.add("hidden");
    this.formTarget.classList.remove("hidden");

    // Ensure focus is set correctly
    setTimeout(() => {
      this.inputTarget.focus();
    }, 100);
  }

  cancel() {
    console.log("profile_bio_controller: Cancelling edit");

    this.formTarget.classList.add("hidden");
    this.displayTarget.classList.remove("hidden");
  }

  handleBlur(event) {
    console.log("profile_bio_controller: Blurring input, saving form...");
    this.save(event);
  }

  save(event) {
    event.preventDefault();

    if (!this.hasFormTarget) {
      console.error("profile_bio_controller: formTarget is missing.");
      return;
    }

    if (!(this.formTarget instanceof HTMLFormElement)) {
      console.error("profile_bio_controller: formTarget is not a valid <form> element.");
      return;
    }

    console.log("profile_bio_controller: Submitting form...");
    this.formTarget.save();
  }

  handleKeydown(event) {
    if (event.key === "Escape") {
      console.log("profile_bio_controller: Escape key pressed, cancelling edit");
      this.cancel();
    }
  }
}
