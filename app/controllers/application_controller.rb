class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception


  helper_method :already_voted?

  private

  def already_voted?(item_id)
    Rails.cache.exist? "RatingsController/#{request.ip}/#{@rating.id}/#{item_id}"
  end
end
