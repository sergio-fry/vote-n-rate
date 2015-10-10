Sidekiq.schedule = YAML.load_file(File.join(Rails.root, "config/sidekiq_scheduler.yml"))

