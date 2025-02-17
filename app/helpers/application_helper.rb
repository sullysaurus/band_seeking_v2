module ApplicationHelper
  def unread_messages_count(user)
    Message.joins(:conversation)
          .where(read: false)
          .where("conversations.recipient_id = ? OR conversations.sender_id = ?", user.id, user.id)
          .where.not(user: user)
          .count
  end
end
