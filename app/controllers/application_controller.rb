class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [
      profile_attributes: [:zip_code]
    ])
  end

  def after_sign_up_path_for(resource)
    if resource.is_a?(User)
      resource.create_profile(zip: params[:user][:zip])
    end
    super
  end
end
