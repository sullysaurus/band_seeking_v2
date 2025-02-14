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
end
