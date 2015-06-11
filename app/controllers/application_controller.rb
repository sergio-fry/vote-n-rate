class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  JWT_SECRET = 'Jfu4760gJqteI2-5868fHwVnsgfEYu'

  helper_method :logged_in?, :current_user

  private

  def logged_in?
    current_user.id.present?
  end

  def current_user
    user_attrs = {}

    if cookies[:auth_crypted].present?
      user_attrs, _ = JWT.decode cookies[:auth_crypted], JWT_SECRET
    end

    user_attrs["identity"] = user_attrs["id"] || request.headers["CF-Connecting-IP"] || request.ip

    OpenStruct.new(user_attrs)
  end

  def authorize!
    unless logged_in?
      redirect_to "http://#{Rails.configuration.x.auth_server}/sign_in?return_url=#{root_url}"
      false
    end
  end
end
