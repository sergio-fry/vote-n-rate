class CronJobRunner
  include Sidekiq::Worker

  def perform(*args)
    klass = args[0].constantize
    klass.perform_later(*args[1])
  end
end

