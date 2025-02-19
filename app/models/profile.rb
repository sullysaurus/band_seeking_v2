class Profile < ApplicationRecord
  belongs_to :user
  has_one_attached :profile_photo
  has_one_attached :banner_image

  # Geocode by zip code
  geocoded_by :zip_code
  after_validation :geocode, if: ->(obj) { obj.zip_code.present? && obj.zip_code_changed? }

  validates :zip_code,
            presence: true,
            format: {
              with: /\A\d{5}(-\d{4})?\z/,
              message: 'should be a valid ZIP code'
            }

  INSTRUMENTS = %w[
    Guitar
    Bass
    Drums
    Vocals
    Piano/Keys
    Saxophone
    Trumpet
    Violin
    Cello
    Flute
    Clarinet
    Trombone
    Percussion
    Ukulele
    Mandolin
    Banjo
    Harmonica
    DJ/Electronic
  ].freeze

  LOOKING_FOR = ['Cover Band', 'Original Band', 'Session Work', 'Jamming'].freeze

  EXPERIENCE_LEVELS = %w[Beginner Intermediate Advanced Pro].freeze

  def profile_photo_url
    if profile_photo.attached?
      Rails.application.routes.url_helpers.rails_blob_path(profile_photo, only_path: true)
    else
      ActionController::Base.helpers.asset_path('default-profile.png')
    end
  end

  def banner_url
    if banner_image.attached?
      Rails.application.routes.url_helpers.rails_blob_path(banner_image, only_path: true)
    else
      ActionController::Base.helpers.asset_path('default-banner.jpg')
    end
  end

  # Custom getter and setter for full_name
  def full_name
    [first_name, last_name].compact.join(' ')
  end

  def full_name=(name)
    return if name.blank?
    names = name.strip.split(/\s+/, 2)
    self.first_name = names.first
    self.last_name = names.last
  end

  require 'httparty'

  # Automatically populate city and state when the zip_code changes
  before_save :populate_city_and_state, if: :will_save_change_to_zip_code?

  def youtube_embed_url
    return nil unless youtube_url.present?
    youtube_url.gsub('watch?v=', 'embed/')
  end

  # Use the user's username for URLs
  def to_param
    user.username
  end

  before_save :clean_empty_arrays

  private

  def populate_city_and_state
    return if zip_code.blank?
    response = HTTParty.get("http://api.zippopotam.us/us/#{zip_code}")
    if response.code == 200
      data = response.parsed_response
      if data['places'].present? && data['places'].first.present?
        self.city = data['places'].first['place name']
        self.state = data['places'].first['state abbreviation']
      end
    end
  rescue StandardError => e
    Rails.logger.error "Error fetching location for zip code #{zip_code}: #{e.message}"
  end

  def clean_empty_arrays
    self.looking_for = looking_for&.reject(&:blank?) if looking_for.is_a?(Array)
    self.instruments_played = instruments_played&.reject(&:blank?) if instruments_played.is_a?(
      Array
    )
  end
end
