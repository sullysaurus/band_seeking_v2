class ProfilesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_profile, only: [:show, :edit, :update, :edit_instagram, :edit_tiktok, :edit_apple_music, :edit_bandcamp, :edit_soundcloud, :update_zip]

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
    respond_to do |format|
      format.html { redirect_to @profile } # ✅ Redirects instead of looking for `edit.html.erb`
      format.turbo_stream
    end
  end
  
  def update
    respond_to do |format|
      if @profile.update(profile_params)
        format.html { redirect_to @profile, notice: 'Profile successfully updated.' }
        format.json do
          render json: { 
            status: :ok, 
            bio: @profile.bio,
            display_name: "#{@profile.first_name} #{@profile.last_name}".strip,
            youtube_url: @profile.youtube_url,
            spotify_url: @profile.spotify_url,
            zip_code: @profile.zip_code
          }
        end
        format.turbo_stream
      else
        format.html { render :edit }
        format.json { render json: { errors: @profile.errors.full_messages }, status: :unprocessable_entity }
        format.turbo_stream { render :update, status: :unprocessable_entity }
      end
    end
  end

  # Instagram Edit Form
  def edit_instagram
    render_social_links_form(:instagram_url, "Instagram", "instagram_frame")
  end

  # TikTok Edit Form
  def edit_tiktok
    render_social_links_form(:tiktok_url, "TikTok", "tiktok_frame")
  end

  # Apple Music Edit Form
  def edit_apple_music
    render_social_links_form(:applemusic_url, "Apple Music", "applemusic_frame")
  end

  # Bandcamp Edit Form
  def edit_bandcamp
    render_social_links_form(:bandcamp_url, "Bandcamp", "bandcamp_frame")
  end

  # SoundCloud Edit Form
  def edit_soundcloud
    render_social_links_form(:soundcloud_url, "SoundCloud", "soundcloud_frame")
  end

  def update_zip
    if @profile.update(zip_code: params[:profile][:zip_code])
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            "zip_code",
            partial: "profiles/zip_code",
            locals: { profile: @profile }
          )
        end
      end
    else
      render turbo_stream: turbo_stream.replace(
        "zip_code",
        partial: "profiles/zip_code",
        locals: { profile: @profile }
      ), status: :unprocessable_entity
    end
  end

  private

  def set_profile
    @profile = Profile.joins(:user).find_by!(users: { username: params[:id] })
  end

  def profile_params
    params.require(:profile).permit(
      :bio, :full_name, :youtube_url, :spotify_url,
      :city, :state, :experience_level, :availability, 
      { looking_for: [] }, { instruments_played: [] },
      :instagram_url, :tiktok_url, :applemusic_url, 
      :bandcamp_url, :soundcloud_url, :website_url, 
      :profile_photo, :banner_image,
      :zip_code
    )
  end

  # DRY method to render social links edit form
  def render_social_links_form(field, label, frame_id)
    render partial: "profiles/social_links_form", 
           locals: { profile: @profile, field: field, label: label, frame_id: frame_id },
           layout: false
  end
end
