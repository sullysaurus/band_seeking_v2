class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  has_one :profile, dependent: :destroy
  accepts_nested_attributes_for :profile

  after_create :ensure_profile

  validates :username, 
    presence: true, 
    uniqueness: true, 
    format: { 
      with: /\A[a-zA-Z0-9_]+\z/, 
      message: "can only contain letters, numbers, and underscores" 
    },
    length: { minimum: 3, maximum: 20 }

  private

  def ensure_profile
    create_profile! unless profile.present?
  end

  def create_profile
    Profile.create!(user: self)
  end
end
