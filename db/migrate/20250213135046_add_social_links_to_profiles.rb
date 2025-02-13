class AddSocialLinksToProfiles < ActiveRecord::Migration[8.0]
  def change
    add_column :profiles, :soundcloud_url, :string
    add_column :profiles, :tiktok_url, :string
    add_column :profiles, :applemusic_url, :string
    add_column :profiles, :bandcamp_url, :string
  end
end
