Rails.application.routes.draw do
  get "home/index"
  root "home#index"

  devise_for :users, controllers: { registrations: "users/registrations" }
  
  devise_scope :user do  
    delete '/users/sign_out' => 'devise/sessions#destroy'     
  end

  # Consolidated Profiles routes under /musicians:
  resources :profiles, path: 'musicians' do
    member do
      patch 'update_zip'
      get :edit_instagram
      get :edit_tiktok
      get :edit_applemusic
      get :edit_bandcamp
      get :edit_soundcloud
    end
  end

  # Health check and other routes remain unchanged:
  get "up" => "rails/health#show", as: :rails_health_check
end
