require "base64"

class Upload < ActiveRecord::Base
  def body=(data)
    super Base64.encode64(data)
  end

  def body
    Base64.decode64 super
  end
end
