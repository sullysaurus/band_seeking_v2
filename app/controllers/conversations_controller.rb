class ConversationsController < ApplicationController
  before_action :authenticate_user!

  def index
    @conversations = Conversation.where("sender_id = ? OR recipient_id = ?", current_user.id, current_user.id)
  end

  def show
    @conversation = Conversation.find(params[:id])
    @messages = @conversation.messages.includes(:user)
    @message = Message.new
    
    # Mark messages as read
    @conversation.messages.unread_for(current_user).update_all(read: true)
    
    # Broadcast updated notification count
    Turbo::StreamsChannel.broadcast_update_to(
      "notifications_#{current_user.id}",
      target: "message_notifications",
      partial: "shared/message_notification_count",
      locals: { user: current_user }
    )
  end

  def create
    if Conversation.between(params[:sender_id], params[:recipient_id]).present?
      @conversation = Conversation.between(params[:sender_id], params[:recipient_id]).first
    else
      @conversation = Conversation.create!(conversation_params)
    end

    redirect_to @conversation
  end

  private

  def conversation_params
    params.permit(:sender_id, :recipient_id)
  end
end 