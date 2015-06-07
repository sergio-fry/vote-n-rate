# config/unicorn.rb
worker_processes 3
timeout 30
preload_app true

before_fork do |server, worker|
  signal.trap 'term' do
    puts 'unicorn master intercepting term and sending myself quit instead'
    process.kill 'quit', process.pid
  end

  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
  signal.trap 'term' do
    puts 'unicorn worker intercepting term and doing nothing. wait for master to send quit'
  end

  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.establish_connection
end



