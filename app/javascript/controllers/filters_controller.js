import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tag", "modal"]

  toggleAllFilters(event) {
    event.preventDefault()
    const modal = document.querySelector('[data-controller="modal"]')
    const modalController = this.application.getControllerForElementAndIdentifier(modal, 'modal')
    modalController.open()
  }

  toggleInstrument(event) {
    event.preventDefault()
    const instrument = event.currentTarget.dataset.instrument
    const currentParams = new URLSearchParams(window.location.search)
    let instruments = currentParams.getAll('instruments[]')
    
    if (instruments.includes(instrument)) {
      instruments = instruments.filter(i => i !== instrument)
    } else {
      instruments.push(instrument)
    }
    
    currentParams.delete('instruments[]')
    instruments.forEach(i => currentParams.append('instruments[]', i))
    
    this.applyFilters(currentParams)
  }

  toggleLookingFor(event) {
    event.preventDefault()
    const lookingFor = event.currentTarget.dataset.lookingFor
    const currentParams = new URLSearchParams(window.location.search)
    let lookingForValues = currentParams.getAll('looking_for[]')
    
    if (lookingForValues.includes(lookingFor)) {
      lookingForValues = lookingForValues.filter(l => l !== lookingFor)
    } else {
      lookingForValues.push(lookingFor)
    }
    
    currentParams.delete('looking_for[]')
    lookingForValues.forEach(l => currentParams.append('looking_for[]', l))
    
    this.applyFilters(currentParams)
  }

  toggleExperience(event) {
    event.preventDefault()
    const experience = event.currentTarget.dataset.experience
    const currentParams = new URLSearchParams(window.location.search)
    
    if (currentParams.get('experience_level') === experience) {
      currentParams.delete('experience_level')
    } else {
      currentParams.set('experience_level', experience)
    }
    
    this.applyFilters(currentParams)
  }

  applyFilters(params) {
    const url = `${window.location.pathname}?${params.toString()}`
    Turbo.visit(url)
  }
}