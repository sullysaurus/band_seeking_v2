class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  has_one :profile, dependent: :destroy
  accepts_nested_attributes_for :profile

  after_create :ensure_profile

  private

  def ensure_profile
    create_profile! unless profile.present?
  end

  def create_profile
    Profile.create!(user: self)
  end
end
