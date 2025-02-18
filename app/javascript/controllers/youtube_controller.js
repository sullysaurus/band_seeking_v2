import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form", "input", "addButton", "playerContainer", "editForm", "editInput"]

  showForm(event) {
    this.addButtonTarget.classList.add("hidden")
    this.formTarget.classList.remove("hidden")
    this.inputTarget.focus()
  }

  showEditForm(event) {
    event.preventDefault()
    this.playerContainerTarget.classList.add("hidden")
    this.editFormTarget.classList.remove("hidden")
    this.editInputTarget.focus()
  }

  cancel(event) {
    event.preventDefault()
    this.formTarget.classList.add("hidden")
    this.addButtonTarget.classList.remove("hidden")
    this.inputTarget.value = ""
  }

  cancelEdit(event) {
    event.preventDefault()
    this.editFormTarget.classList.add("hidden")
    this.playerContainerTarget.classList.remove("hidden")
    this.editInputTarget.value = this.editInputTarget.defaultValue
  }

  handleKeydown(event) {
    if (event.key === "Escape") {
      if (this.hasEditFormTarget && !this.editFormTarget.classList.contains("hidden")) {
        this.cancelEdit(event)
      } else {
        this.cancel(event)
      }
    }
  }

  save(event) {
    // Form submission is handled by Turbo
  }

  removePlayer(event) {
    event.preventDefault()
    const form = document.createElement("form")
    form.method = "POST"
    form.action = this.element.dataset.profilePath
    form.setAttribute("data-turbo-frame", "youtube_section")

    const methodInput = document.createElement("input")
    methodInput.type = "hidden"
    methodInput.name = "_method"
    methodInput.value = "PATCH"

    const youtubeUrlInput = document.createElement("input")
    youtubeUrlInput.type = "hidden"
    youtubeUrlInput.name = "profile[youtube_url]"
    youtubeUrlInput.value = ""

    const tokenInput = document.createElement("input")
    tokenInput.type = "hidden"
    tokenInput.name = "authenticity_token"
    tokenInput.value = document.querySelector("meta[name='csrf-token']").content

    form.appendChild(methodInput)
    form.appendChild(youtubeUrlInput)
    form.appendChild(tokenInput)
    document.body.appendChild(form)
    form.requestSubmit()
    form.remove()
  }
} 