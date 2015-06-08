class ItemsController < ApplicationController
  before_action :set_rating
  before_filter :authorize!, except: [:index, :vote, :unvote]

  def index
    render json: @rating.items.sort_by(&:rating).reverse
  end

  def vote
    @item = @rating.items.find { |it| it.id == params[:id] }

    unless already_voted?(@item.id)
      Rails.cache.fetch "RatingsController/#{request.ip}/#{@rating.id}/#{@item.id}", expires_in: 30.minutes do
        @rating.vote_for(@item.id, 1)
      end
    end

    render json: @item
  end

  def update
    @item = @rating.items.find { |it| it.id == params[:id] }

    @rating.update_item(params[:id], params[:item])

    render json: @item
  end

  def unvote
    @item = @rating.items.find { |it| it.id == params[:id] }

    if already_voted?(@item.id)
      @rating.vote_for(@item.id, -1)
      Rails.cache.delete "RatingsController/#{request.ip}/#{@rating.id}/#{@item.id}"
    end

    render json: @item
  end

  def create
    @item = Item.new params[:item]
    @item.id = next_item_id
    @rating.add_item @item

    render json: @item
  end

  def destroy
    @rating.delete_item params[:id]
    
    render json: {}
  end

  private

  def authorize!
    if @rating.user_id != current_user.id
      render :text => "Запрещено: не Ваш рейтинг", status: 403
      false
    end
  end

  # если будут дубликаты, то это признание проекта
  def next_item_id
    Time.now.to_f.to_s.sub(".", "")
  end

  def set_rating
    @rating = Rating.find(params[:rating_id])
  end
end
