Rails
  .application
  .routes
  .draw do
    get '/health', to: proc { [200, {}, ['ok']] }
    get 'home/index'
    root 'home#index'

    devise_for :users, controllers: { registrations: 'users/registrations' }

    devise_scope :user do
      delete '/users/sign_out' => 'devise/sessions#destroy'
    end

    # Consolidated Profiles routes under /musicians:
    resources :profiles, path: 'musicians' do
      member { patch 'update_zip' }
    end

    # Health check and other routes remain unchanged:
    get 'up' => 'rails/health#show', :as => :rails_health_check

    resources :conversations do
      resources :messages, only: [:create]
    end
  end
