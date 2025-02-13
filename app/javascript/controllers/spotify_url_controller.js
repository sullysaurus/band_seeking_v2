import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["addButton", "form", "input", "playerContainer", "editForm", "editInput"]

  showForm(event) {
    this.addButtonTarget.classList.add("hidden")
    this.formTarget.classList.remove("hidden")
    this.inputTarget.focus()
  }

  showEditForm(event) {
    event.preventDefault()
    this.editFormTarget.classList.remove("hidden")
    this.editInputTarget.focus()
  }

  cancel(event) {
    event.preventDefault()
    this.hideForm()
  }

  cancelEdit(event) {
    event.preventDefault()
    this.hideEditForm()
  }

  hideForm() {
    this.formTarget.classList.add("hidden")
    this.addButtonTarget.classList.remove("hidden")
    this.inputTarget.value = ""
  }

  hideEditForm() {
    this.editFormTarget.classList.add("hidden")
  }

  handleKeydown(event) {
    if (event.key === "Escape") {
      if (this.editFormTarget?.classList.contains("hidden")) {
        this.hideForm()
      } else {
        this.hideEditForm()
      }
    }
  }

  removePlayer(event) {
    event.preventDefault()
    
    if (confirm("Are you sure you want to remove this Spotify track?")) {
      const formData = new FormData()
      formData.append('profile[spotify_url]', '')

      fetch(this.element.querySelector('form').action, {
        method: 'PATCH',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector("[name='csrf-token']").content
        },
        credentials: 'same-origin'
      })
      .then(response => {
        if (response.ok) {
          window.location.reload()
        }
      })
    }
  }

  save(event) {
    event.preventDefault()
    const formData = new FormData(event.target)

    fetch(event.target.action, {
      method: 'PATCH',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'X-CSRF-Token': document.querySelector("[name='csrf-token']").content
      },
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.ok) {
        window.location.reload()
      }
    })
  }
} 