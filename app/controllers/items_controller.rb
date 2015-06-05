class ItemsController < ApplicationController
  before_action :set_rating, only: [:show, :vote, :edit, :update, :destroy]

  def vote
    delta = (params[:v].to_i < 0) ? -1 : 1

    if already_voted?(params[:id])
      unvote(params[:id])
    else
      vote_for(params[:id], delta)
    end

    redirect_to @rating
  end

  private
  def set_rating
    @rating = Rating.find(params[:rating_id])
  end

  def unvote(item_id)
    return unless already_voted?(item_id)

    delta = Rails.cache.read "RatingsController/#{request.ip}/#{@rating.id}/#{item_id}"
    @rating.vote_for(item_id, -delta.to_f)

    Rails.cache.delete "RatingsController/#{request.ip}/#{@rating.id}/#{item_id}"
  end

  def vote_for(item_id, delta)
    Rails.cache.fetch "RatingsController/#{request.ip}/#{@rating.id}/#{item_id}", expires_in: 30.minutes do
      @rating.vote_for(item_id, delta)

      delta.to_f
    end
  end


end
