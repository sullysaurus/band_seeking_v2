class Users::RegistrationsController < Devise::RegistrationsController
    before_action :configure_sign_up_params, only: [:create]
    before_action :configure_account_update_params, only: [:update]
  
    protected
  
    # Allow only username, email, and password during sign-up
    def configure_sign_up_params
      devise_parameter_sanitizer.permit(:sign_up, keys: [:username])
    end
  
    # Allow full profile editing after sign-up
    def configure_account_update_params
      devise_parameter_sanitizer.permit(:account_update, keys: [
        :username, :email, :password, :password_confirmation,
        profile_attributes: [:bio, :city, :state, :experience_level, :availability, 
                             :looking_for, :spotify_url, :youtube_url, 
                             :instagram_url, :website_url, instruments_played: []]
      ])
    end
  
    def after_sign_up_path_for(resource)
      profile_path(resource.profile) # Redirect to the show page of the user's profile
    end
  end
  