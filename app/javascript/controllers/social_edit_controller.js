import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["display", "form", "input"];
  static values = {
    type: String,        // e.g., "Instagram"
    updateUrl: String    // URL to send the AJAX update (like profile_path)
  }

  showInput(event) {
    event.preventDefault();
    this.displayTarget.classList.add("hidden");
    this.formTarget.classList.remove("hidden");
    this.inputTarget.focus();
  }

  cancel(event) {
    event.preventDefault();
    // Reset value to the originally stored one in the display dataset
    this.inputTarget.value = this.displayTarget.dataset.original || "";
    this.formTarget.classList.add("hidden");
    this.displayTarget.classList.remove("hidden");
  }

  save(event) {
    event.preventDefault();
    const newValue = this.inputTarget.value.trim();

    // Update display – using a prefix '@' if there is a value, else "Add {Type}"
    if (newValue === "") {
      this.displayTarget.textContent = `Add ${this.typeValue}`;
    } else {
      this.displayTarget.textContent = "@" + newValue.replace("@", "");
    }

    // Store the new value in a data attribute (if needed)
    this.displayTarget.dataset.original = newValue;
    this.formTarget.classList.add("hidden");
    this.displayTarget.classList.remove("hidden");

    // Optionally, send an AJAX request to update on the server:
    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(this.updateUrlValue, {
      method: "PATCH",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        // Assumes your parameter key is the downcased type plus "_handle"
        [this.typeValue.toLowerCase() + "_handle"]: newValue
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network error updating social link");
        }
        return response.json();
      })
      .then(data => console.log("Update successful:", data))
      .catch(error => console.error("Error updating social link:", error));
  }
} 