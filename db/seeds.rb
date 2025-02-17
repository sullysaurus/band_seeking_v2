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

# NC Cities and their zip codes
NC_LOCATIONS = [
  { city: 'Raleigh', state: 'NC', zip: '27617' },
  { city: 'Cary', state: 'NC', zip: '27513' },
  { city: 'Durham', state: 'NC', zip: '27701' },
  { city: 'Chapel Hill', state: 'NC', zip: '27514' },
  { city: 'Apex', state: 'NC', zip: '27502' },
  { city: 'Wake Forest', state: 'NC', zip: '27587' },
  { city: 'Holly Springs', state: 'NC', zip: '27540' },
  { city: 'Morrisville', state: 'NC', zip: '27560' },
  { city: 'Garner', state: 'NC', zip: '27529' },
  { city: 'Knightdale', state: 'NC', zip: '27545' }
]

# Default banner URLs
BANNER_URLS = [
  'https://images.unsplash.com/photo-1508973379184-7517410fb0bc?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2070&auto=format&fit=crop'
]

# Create users with profiles
puts "Creating users and profiles..."

10.times do |i|
  first_name = Faker::Name.first_name
  last_name = Faker::Name.last_name
  location = NC_LOCATIONS[i]

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
    city: location[:city],
    state: location[:state],
    zip_code: location[:zip],
    bio: Faker::Lorem.paragraph(sentence_count: 3),
    instruments_played: played_instruments,
    looking_for: looking_for_options,
    experience_level: EXPERIENCE_LEVELS.sample
  )

  user.save!

  puts "Created user #{i + 1}: #{user.username} with profile and instruments"
end

puts "Seed completed! Created #{User.count} users with profiles"

# Update existing musician profiles with default banner
Profile.where(banner_image: [nil, '']).find_each do |profile|
  profile.update_column(:banner_image, 'default-banner.jpg')
end
