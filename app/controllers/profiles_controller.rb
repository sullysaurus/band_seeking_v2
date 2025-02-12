class ProfilesController < ApplicationController
    before_action :authenticate_user!
    before_action :set_profile, only: [:show, :edit, :update]
  
    def show
    end
  
    def edit
    end
  
    def update
      if @profile.update(profile_params)
        redirect_to @profile, notice: "Profile updated successfully!"
      else
        render :edit
      end
    end
  
    private
  
    def set_profile
      @profile = current_user.profile
    end
  
    def profile_params
      params.require(:profile).permit(:bio, :city, :state, :experience_level, 
                                      :availability, :looking_for, 
                                      :spotify_link, :youtube_link, 
                                      :instagram_link, :website_url, instruments_played: [])
    end
  end
  