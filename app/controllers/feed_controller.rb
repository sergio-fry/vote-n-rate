class FeedController < ApplicationController
  def index
    @ratings = Rating.published.order("created_at DESC").limit(20)

    respond_to do |format|
      format.atom 
      format.html { redirect_to :format => :atom }
    end
  end
end
