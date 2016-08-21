if defined?(Konacha)
  Konacha.configure do |config|
    require 'capybara/poltergeist'
    config.driver = :poltergeist
    config.spec_dir = "spec/javascripts"
  end
end