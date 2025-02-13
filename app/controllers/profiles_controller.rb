class ProfilesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_profile, only: [:show, :edit, :update]

  def new
    @profile = Profile.new
  end

  def create
    @profile = current_user.build_profile(profile_params)
    if @profile.save
      redirect_to @profile, notice: "Profile created successfully!"
    else
      render :new
    end
  end

  def show
  end

  def edit
  end

  def update
    respond_to do |format|
      if @profile.update(profile_params)
        format.html { redirect_to @profile }
        format.json { head :ok }
      else
        format.html { render :edit }
        format.json { render json: @profile.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_profile
    @profile = current_user.profile
  end

  def profile_params
    params.require(:profile).permit(:bio, :city, :state, :experience_level, 
                                    :availability, { looking_for: [] }, 
                                    :spotify_link, :youtube_link, 
                                    :instagram_link, :website_url, 
                                    :profile_photo, :banner_image,
                                    { instruments_played: [] })
  end
end
