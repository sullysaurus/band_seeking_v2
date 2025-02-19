require 'active_support/core_ext/integer/time'

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot for better performance and memory savings (ignored by Rake tasks).
  config.eager_load = true

  # Full error reports are disabled.
  config.consider_all_requests_local = false

  # Turn on fragment caching in view templates.
  config.action_controller.perform_caching = true

  # Cache assets for far-future expiry since they are all digest stamped.
  config.public_file_server.headers = { 'cache-control' => "public, max-age=#{1.year.to_i}" }

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.asset_host = "http://assets.example.com"

  # Use persistent storage for Active Storage (Railway provides persistent storage)
  config.active_storage.service = :google
  config.active_storage.resolve_model_to_route = :rails_storage_proxy

  # Assume all access to the app is happening through a SSL-terminating reverse proxy.
  config.assume_ssl = true

  # Force SSL
  config.force_ssl = true

  # Log to STDOUT with the current request id as a default log tag.
  config.log_tags = [:request_id]
  config.logger = ActiveSupport::TaggedLogging.logger(STDOUT)

  # Change to "debug" to log everything (including potentially personally-identifiable information!)
  config.log_level = ENV.fetch('RAILS_LOG_LEVEL', 'info')

  # Prevent health checks from clogging up the logs.
  config.silence_healthcheck_path = '/up'

  # Don't log any deprecations.
  config.active_support.report_deprecations = false

  # Replace the default in-process memory cache store with a durable alternative.
  config.cache_store = :solid_cache_store

  # Replace the default in-process and non-durable queuing backend for Active Job.
  config.active_job.queue_adapter = :solid_queue
  config.solid_queue.connects_to = { database: { writing: :queue } }

  # Set host to be used by links generated in mailer templates.
  config.action_mailer.default_url_options = {
    host: ENV.fetch('RAILWAY_STATIC_URL', 'bandmate.up.railway.app')
  }

  # Ensure assets are compiled
  config.assets.compile = true
  config.assets.digest = true

  # Ensure JavaScript is properly compiled
  config.assets.js_compressor = :terser

  # Action Cable configuration
  config.action_cable.disable_request_forgery_protection = true

  # Set the cable URL using your environment variable; adjust the fallback as needed.
  cable_url = "wss://#{ENV.fetch('RAILWAY_STATIC_URL', 'bandmate.up.railway.app')}/cable"
  config.action_cable.url = cable_url

  # Restrict allowed request origins to your application's domain.
  config.action_cable.allowed_request_origins = [
    "https://#{ENV.fetch('RAILWAY_STATIC_URL', 'bandmate.up.railway.app')}"
  ]

  # Optional: Uncomment the following line if you wish to log Action Cable connection events for debugging.
  # config.action_cable.log_tags = [->(request) { request.uuid }]
end
