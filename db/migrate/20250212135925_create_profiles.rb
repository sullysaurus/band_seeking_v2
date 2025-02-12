class CreateProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.text :bio
      t.string :city
      t.string :state
      t.text :instruments_played, array: true, default: []
      t.string :experience_level
      t.string :availability
      t.string :looking_for
      t.string :spotify_link
      t.string :youtube_link
      t.string :instagram_link
      t.string :website_url

      t.timestamps
    end

    add_index :profiles, :instruments_played, using: :gin
  end
end
