class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :user

  validates :body, presence: true

  after_create_commit -> { 
    broadcast_append_to conversation,
      partial: "messages/message",
      locals: { message: self, current_user: user }
  }
end 