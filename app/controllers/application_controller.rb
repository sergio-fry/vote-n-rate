class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  JWT_SECRET = 'Jfu4760gJqteI2-5868fHwVnsgfEYu'

  helper_method :already_voted?, :logged_in?, :current_user

  private

  def already_voted?(item_id)
    Rails.cache.exist? "RatingsController/#{request.ip}/#{@rating.id}/#{item_id}"
  end


  def logged_in?
    current_user.id.present?
  end

  def current_user
    user_attrs = {}

    if cookies[:auth_crypted].present?
      user_attrs, _ = JWT.decode cookies[:auth_crypted], JWT_SECRET
    end

    OpenStruct.new(user_attrs)
  end
end
