import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['form', 'input', 'addButton', 'playerContainer', 'editForm', 'editInput']

  connect() {
    this.handleFrameLoad = this.handleFrameLoad.bind(this)
    document.addEventListener('turbo:frame-load', this.handleFrameLoad)
  }

  handleFrameLoad(event) {
    if (event.target.id === 'spotify_section') {
      if (this.hasFormTarget) {
        this.formTarget.classList.add('hidden')
        this.addButtonTarget.classList.remove('hidden')
      }
      if (this.hasEditFormTarget) {
        this.editFormTarget.classList.add('hidden')
        this.playerContainerTarget.classList.remove('hidden')
      }
    }
  }

  showForm(event) {
    this.addButtonTarget.classList.add('hidden')
    this.formTarget.classList.remove('hidden')
    this.inputTarget.focus()
  }

  showEditForm(event) {
    event.preventDefault()
    this.playerContainerTarget.classList.add('hidden')
    this.editFormTarget.classList.remove('hidden')
    this.editInputTarget.focus()
  }

  cancel(event) {
    event.preventDefault()
    this.formTarget.classList.add('hidden')
    this.addButtonTarget.classList.remove('hidden')
    this.inputTarget.value = ''
  }

  cancelEdit(event) {
    event.preventDefault()
    this.editFormTarget.classList.add('hidden')
    this.playerContainerTarget.classList.remove('hidden')
    this.editInputTarget.value = this.editInputTarget.defaultValue
  }

  handleKeydown(event) {
    if (event.key === 'Escape') {
      if (this.hasEditFormTarget && !this.editFormTarget.classList.contains('hidden')) {
        this.cancelEdit(event)
      } else {
        this.cancel(event)
      }
    }
  }

  removePlayer(event) {
    event.preventDefault()
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = this.element.dataset.profilePath
    form.setAttribute('data-turbo-frame', 'spotify_section')

    const methodInput = document.createElement('input')
    methodInput.type = 'hidden'
    methodInput.name = '_method'
    methodInput.value = 'PATCH'

    const spotifyUrlInput = document.createElement('input')
    spotifyUrlInput.type = 'hidden'
    spotifyUrlInput.name = 'profile[spotify_url]'
    spotifyUrlInput.value = ''

    const tokenInput = document.createElement('input')
    tokenInput.type = 'hidden'
    tokenInput.name = 'authenticity_token'
    tokenInput.value = document.querySelector("meta[name='csrf-token']").content

    form.appendChild(methodInput)
    form.appendChild(spotifyUrlInput)
    form.appendChild(tokenInput)
    document.body.appendChild(form)
    form.requestSubmit()
    form.remove()
  }

  disconnect() {
    document.removeEventListener('turbo:frame-load', this.handleFrameLoad)
  }
}
