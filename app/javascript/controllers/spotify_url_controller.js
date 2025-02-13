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
    .then(response => response.json())
    .then(data => {
      if (data.spotify_url) {
        const embedUrl = data.spotify_url.replace('spotify.com/', 'spotify.com/embed/')
        if (this.hasPlayerContainerTarget) {
          // Update existing iframe
          const iframe = this.playerContainerTarget.querySelector('iframe')
          iframe.src = embedUrl
          this.hideEditForm()
        } else {
          // Create new player container
          this.addButtonTarget.classList.add('hidden')
          const container = document.createElement('div')
          container.className = 'relative aspect-video rounded-lg overflow-hidden bg-gray-100'
          container.dataset.spotifyUrlTarget = 'playerContainer'
          container.innerHTML = `
            <iframe 
              src="${embedUrl}"
              class="absolute inset-0 w-full h-full"
              frameborder="0"
              allowtransparency="true"
              allow="encrypted-media">
            </iframe>
            <div class="absolute top-2 right-2 flex gap-2">
              <button class="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      data-action="spotify-url#showEditForm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
              </button>
              <button class="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      data-action="spotify-url#removePlayer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          `
          this.addButtonTarget.insertAdjacentElement('beforebegin', container)
          this.hideForm()
        }
      }
    })
    .catch(error => console.error('Error:', error))
  }
} 