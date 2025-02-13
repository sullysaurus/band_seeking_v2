class Profile < ApplicationRecord
  attr_accessor :full_name

  belongs_to :user
  has_one_attached :profile_photo
  has_one_attached :banner_image

  before_save :split_full_name, if: :full_name

  private

  def split_full_name
    names = full_name.strip.split(/\s+/, 2)
    self.first_name = names[0]
    self.last_name = names[1]
  end
end
