class HomeController < ApplicationController
  before_filter :authorize!

  def index
    @ratings = Rating.where(user_id: current_user.id)
  end
end
