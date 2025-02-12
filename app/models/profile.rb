class Profile < ApplicationRecord
  belongs_to :user
  has_one_attached :profile_photo
  has_one_attached :banner_image
end
