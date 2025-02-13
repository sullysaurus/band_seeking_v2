class RenameSocialLinksInProfiles < ActiveRecord::Migration[8.0]
  def change
    rename_column :profiles, :spotify_link, :spotify_url
    rename_column :profiles, :youtube_link, :youtube_url
    rename_column :profiles, :instagram_link, :instagram_url
  end
end
