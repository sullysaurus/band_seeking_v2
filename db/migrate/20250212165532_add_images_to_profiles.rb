class AddImagesToProfiles < ActiveRecord::Migration[8.0]
  def change
    add_column :profiles, :profile_photo, :string
    add_column :profiles, :banner_image, :string
  end
end
