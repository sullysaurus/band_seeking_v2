# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Clear existing data
puts "Clearing existing data..."
Profile.destroy_all
User.destroy_all

# Create users with profiles
puts "Creating users and profiles..."

# Valid NC zip codes
nc_zip_codes = ['27617', '27560', '27513', '27519', '27539', '27540', '27511', '27518', '27502', '27523']

10.times do |i|
  # Create user with profile attributes
  user = User.new(
    email: Faker::Internet.unique.email,
    username: Faker::Internet.unique.username(specifier: 5..10),
    password: 'password123',
    password_confirmation: 'password123'
  )

  # Build profile before saving
  user.build_profile(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    zip_code: nc_zip_codes[i],  # Use a valid NC zip code
    bio: Faker::Lorem.paragraph(sentence_count: 3)
  )

  # Save both user and profile
  user.save!

  puts "Created user #{i + 1}: #{user.username} with profile"
end

puts "Seed completed! Created #{User.count} users with profiles."
