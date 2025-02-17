class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :user

  validates :body, presence: true

  scope :unread_for, ->(user) { where(read: false).where.not(user: user) }

  after_create_commit -> { 
    broadcast_append_to conversation,
      partial: "messages/message",
      locals: { message: self, current_user: user }
    
    # Broadcast notification count update
    broadcast_update_to "notifications_#{conversation.recipient.id}",
      target: "message_notifications",
      partial: "shared/message_notification_count",
      locals: { user: conversation.recipient }
  }
end 