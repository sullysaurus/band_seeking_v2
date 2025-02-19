class AddChannelHashToSolidCableMessages < ActiveRecord::Migration[7.1]
  def change
    add_column :solid_cable_messages, :channel_hash, :string
    add_index :solid_cable_messages, :channel_hash
  end
end
