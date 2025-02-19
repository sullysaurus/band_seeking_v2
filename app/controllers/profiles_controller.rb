class ProfilesController < ApplicationController
  before_action :authenticate_user!, except: [:show]
  before_action :set_profile, only: %i[show edit update update_zip]
  before_action :authorize_profile_edit!, only: [:update]

  def new
    @profile = Profile.new
  end

  def create
    @profile = current_user.build_profile(profile_params)
    if @profile.save
      redirect_to @profile, notice: 'Profile created successfully!'
    else
      render :new
    end
  end

  def show; end

  def edit
    respond_to do |format|
      format.html { redirect_to @profile } # ✅ Redirects instead of looking for `edit.html.erb`
      format.turbo_stream
    end
  end

  def update
    respond_to do |format|
      if @profile.update(profile_params)
        format.turbo_stream do
          if params[:profile][:full_name].present?
            render turbo_stream:
                     turbo_stream.replace(
                       'profile_name',
                       partial: 'profiles/profile_name',
                       locals: {
                         profile: @profile
                       }
                     )
          elsif params[:profile][:zip_code].present?
            render turbo_stream:
                     turbo_stream.replace(
                       'location_frame',
                       partial: 'profiles/location',
                       locals: {
                         profile: @profile
                       }
                     )
          elsif params[:profile][:bio].present?
            render turbo_stream:
                     turbo_stream.replace(
                       'bio_frame',
                       partial: 'profiles/about',
                       locals: {
                         profile: @profile
                       }
                     )
          elsif params[:profile][:banner_image].present?
            render turbo_stream:
                     turbo_stream.replace(
                       'banner_frame',
                       partial: 'profiles/banner',
                       locals: {
                         profile: @profile
                       }
                     )
          else
            redirect_to profile_path(@profile.user.username)
          end
        end
        format.html { redirect_to profile_path(@profile.user.username) }
      else
        format.turbo_stream { head :unprocessable_entity }
        format.html { render :edit }
      end
    end
  end

  def update_zip
    @profile.update(zip_code: params[:profile][:zip_code])

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream:
                 turbo_stream.replace(
                   'zip_code',
                   partial: 'profiles/zip_code',
                   locals: {
                     profile: @profile
                   }
                 ),
               status: (@profile.errors.empty? ? :ok : :unprocessable_entity)
      end
    end
  end

  def index
    @profiles = Profile.includes(:user).with_attached_profile_photo

    # Apply location filter if zip_code is present
    if params[:zip_code].present?
      radius = params[:radius].presence || 25
      @profiles = @profiles.near(params[:zip_code], radius.to_i)
    end

    # Existing filters
    if params[:instruments].present?
      @profiles =
        @profiles.where('instruments_played::text[] && ?', "{#{params[:instruments].join(',')}}")
    end

    if params[:looking_for].present?
      @profiles = @profiles.where('looking_for::text[] && ?', "{#{params[:looking_for].join(',')}}")
    end

    if params[:experience_level].present?
      @profiles = @profiles.where(experience_level: params[:experience_level])
    end
  end

  private

  def set_profile
    user =
      if params[:id].to_i.to_s == params[:id]
        # If the param is a number
        User.find(params[:id])
      else
        User.find_by!(username: params[:id])
      end
    @profile = user.profile || user.create_profile
  end

  def authorize_profile_edit!
    unless current_user&.profile == @profile
      respond_to do |format|
        format.html do
          redirect_to profile_path(@profile.user.username),
                      alert: "You can't edit someone else's profile"
        end
        format.turbo_stream { head :unauthorized }
      end
    end
  end

  def profile_params
    params
      .require(:profile)
      .permit(
        :bio,
        :full_name,
        :youtube_url,
        :spotify_url,
        :city,
        :state,
        :experience_level,
        :availability,
        { looking_for: [] },
        { instruments_played: [] },
        :instagram_url,
        :profile_photo,
        :banner_image,
        :zip_code
      )
  end
end
