class Profile < ApplicationRecord
  belongs_to :user
  has_one_attached :profile_photo
  has_one_attached :banner_image

  # Geocode by zip code
  geocoded_by :zip_code
  after_validation :geocode

  validates :zip_code, presence: true, format: { 
    with: /\A\d{5}(-\d{4})?\z/, 
    message: "should be a valid ZIP code"
  }

  # Custom getter and setter for full_name (if needed)
  def full_name
    [first_name, last_name].compact.join(" ")
  end

  def full_name=(name)
    return if name.blank?
    names = name.strip.split(/\s+/, 2)
    self.first_name = names.first
    self.last_name  = names.last
  end

  require 'httparty'
  
  # Automatically populate city and state when the zip_code changes
  before_save :populate_city_and_state, if: :will_save_change_to_zip_code?
  
  private
  
  def populate_city_and_state
    return if zip_code.blank?
    response = HTTParty.get("http://api.zippopotam.us/us/#{zip_code}")
    if response.code == 200
      data = response.parsed_response
      if data["places"].present? && data["places"].first.present?
        self.city  = data["places"].first["place name"]
        self.state = data["places"].first["state abbreviation"]
      end
    end
  rescue StandardError => e
    Rails.logger.error "Error fetching location for zip code #{zip_code}: #{e.message}"
  end
end
