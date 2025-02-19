# syntax=docker/dockerfile:1
# check=error=true

# This Dockerfile is designed for production, not development. Use with Kamal or build'n'run by hand:
# docker build -t band_seeking .
# docker run -d -p 80:80 -e RAILS_MASTER_KEY=<value from config/master.key> --name band_seeking band_seeking

# For a containerized dev environment, see Dev Containers: https://guides.rubyonrails.org/getting_started_with_devcontainer.html

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version
ARG RUBY_VERSION=3.3.0
FROM ruby:3.3.0-slim

# Install Node.js and npm
RUN apt-get update -qq && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install essential Linux packages
RUN apt-get update -qq && \
    apt-get install -y \
    build-essential \
    libpq-dev \
    postgresql-client \
    git

# Set working directory
WORKDIR /rails

# Install Ruby dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Install JS dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code
COPY . .

# Add build script
COPY bin/start /usr/bin/
RUN chmod +x /usr/bin/start

# Start the server by default
CMD ["/usr/bin/start"]

# Final stage for app image
FROM ruby:3.3.0-slim

# Copy built artifacts: gems, application
COPY --from=build /rails /rails

# Run and own only the runtime files as a non-root user for security
RUN groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
    chown -R rails:rails db log storage tmp
USER 1000:1000

# Entrypoint prepares the database.
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Start server via Thruster by default, this can be overwritten at runtime
EXPOSE 80
CMD ["./bin/thrust", "./bin/rails", "server"]
