class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  validates :username, presence: true, uniqueness: true

  has_one :profile, dependent: :destroy
  after_create :create_profile

  private

  def create_profile
    Profile.create!(user: self)
  end
end
