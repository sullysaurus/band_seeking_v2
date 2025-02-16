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

# List of instruments for random selection
INSTRUMENTS = [
  'Guitar', 'Bass', 'Drums', 'Vocals', 'Piano', 'Keyboard',
  'Saxophone', 'Trumpet', 'Violin', 'Cello'
]

LOOKING_FOR = [
  'Cover Band', 'Original Band', 'Session Work', 'Jamming'
]

EXPERIENCE_LEVELS = [
  'Beginner', 'Intermediate', 'Advanced', 'Professional'
]

# Create users with profiles
puts "Creating users and profiles..."

# Valid NC zip codes
nc_zip_codes = ['27617', '27560', '27513', '27519', '27539', '27540', '27511', '27518', '27502', '27523']

10.times do |i|
  first_name = Faker::Name.first_name
  last_name = Faker::Name.last_name

  user = User.new(
    email: Faker::Internet.unique.email,
    username: "#{first_name.downcase}#{rand(100..999)}",
    password: 'password123',
    password_confirmation: 'password123'
  )

  # Get random instruments and looking for options
  played_instruments = INSTRUMENTS.sample(rand(1..3))
  looking_for_options = LOOKING_FOR.sample(rand(1..3))

  profile = user.build_profile(
    first_name: first_name,
    last_name: last_name,
    zip_code: nc_zip_codes[i],
    bio: Faker::Lorem.paragraph(sentence_count: 3),
    instruments_played: played_instruments,
    looking_for: looking_for_options,
    experience_level: EXPERIENCE_LEVELS.sample
  )

  user.save!

  puts "Created user #{i + 1}: #{user.username} with profile and instruments"
end

puts "Seed completed! Created #{User.count} users with profiles"
