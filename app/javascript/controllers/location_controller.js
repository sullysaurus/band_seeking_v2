import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["display", "form", "input"];

  showEdit() {
    // Hide the static display and show the edit form
    this.displayTarget.classList.add("hidden");
    this.formTarget.classList.remove("hidden");
    this.inputTarget.focus();
  }

  cancelEdit() {
    // Hide the edit form and show the static display again
    this.formTarget.classList.add("hidden");
    this.displayTarget.classList.remove("hidden");
  }

  update(event) {
    event.preventDefault();
    const url = this.data.get("url"); // Expecting a data attribute: data-location-editor-url="<%= profile_path(@profile) %>"
    const zipCode = this.inputTarget.value;

    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").getAttribute("content")
      },
      body: JSON.stringify({ profile: { zip_code: zipCode } })
    })
      .then(response => response.json())
      .then((data) => {
        // Update the display element with the new zip code
        this.displayTarget.textContent = data.zip_code || "Set your location";
        this.cancelEdit();
      })
      .catch((error) => {
        console.error("Error updating location", error);
        alert("Failed to update location. Please try again.");
      });
  }
} 