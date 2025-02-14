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
    # This assumes you have a template, e.g. app/views/profiles/show.html.erb
  end

  def edit
    # Your edit action logic (if needed)
  end

  def update
    if @profile.update(profile_params)
      redirect_to profile_path(@profile), notice: 'Profile successfully updated.'
    else
      render :edit
    end
  end

  private

  def set_profile
    @profile = Profile.find(params[:id])
  end

  def profile_params
    params.require(:profile).permit(
      :bio,
      :full_name,
      :youtube_url,
      :spotify_url,
      :city,
      :state,
      :zip_code,
      :experience_level,
      :availability,
      { looking_for: [] },
      { instruments_played: [] },
      :instagram_link,
      :website_url,
      :profile_photo,
      :banner_image
    )
  end
end
