class CreateSolidCableMessages < ActiveRecord::Migration[7.1]
  def change
    create_table :solid_cable_messages do |t|
      t.string :stream_name
      t.string :message_type
      t.json :content
      t.datetime :created_at, null: false
    end

    add_index :solid_cable_messages, :stream_name
    add_index :solid_cable_messages, :created_at
  end
end
