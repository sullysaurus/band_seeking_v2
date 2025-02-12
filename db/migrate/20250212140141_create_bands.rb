class CreateBands < ActiveRecord::Migration[8.0]
  def change
    create_table :bands do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.string :city
      t.string :state
      t.string :band_type
      t.string :instagram_handle
      t.string :website_url
      t.string :bandsintown_url
      t.string :spotify_url
      t.string :youtube_url
      t.text :seeking, array: true, default: []

      t.timestamps
    end

    add_index :bands, :name
    add_index :bands, :band_type
    add_index :bands, :city
    add_index :bands, :state
    add_index :bands, :seeking, using: :gin
  end
end
