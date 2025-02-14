class RemoveCoordinatesFromProfiles < ActiveRecord::Migration[6.0]
  def change
    remove_column :profiles, :latitude, :float
    remove_column :profiles, :longitude, :float
  end
end
