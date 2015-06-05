class RatingsController < ApplicationController
  before_action :set_rating, only: [:show, :vote, :edit, :update, :destroy]

  helper_method :already_voted?

  # GET /ratings
  # GET /ratings.json
  def index
    @ratings = Rating.all
  end

  # GET /ratings/1
  # GET /ratings/1.json
  def show
  end

  def vote
    delta = (params[:v].to_i < 0) ? -1 : 1

    if already_voted?(params[:item_id])
      unvote(params[:item_id])
    else
      vote_for(params[:item_id], delta)
    end

    redirect_to @rating
  end

  # GET /ratings/new
  def new
    @rating = Rating.new
  end

  # GET /ratings/1/edit
  def edit
  end

  # POST /ratings
  # POST /ratings.json
  def create
    @rating = Rating.new(rating_params)

    respond_to do |format|
      if @rating.save
        format.html { redirect_to @rating, notice: 'Rating was successfully created.' }
        format.json { render :show, status: :created, location: @rating }
      else
        format.html { render :new }
        format.json { render json: @rating.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /ratings/1
  # PATCH/PUT /ratings/1.json
  def update
    respond_to do |format|
      if @rating.update(rating_params)
        format.html { redirect_to @rating, notice: 'Rating was successfully updated.' }
        format.json { render :show, status: :ok, location: @rating }
      else
        format.html { render :edit }
        format.json { render json: @rating.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /ratings/1
  # DELETE /ratings/1.json
  def destroy
    @rating.destroy
    respond_to do |format|
      format.html { redirect_to ratings_url, notice: 'Rating was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def already_voted?(item_id)
    Rails.cache.exist? "RatingsController/#{request.ip}/#{@rating.id}/#{item_id}"
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


    # Use callbacks to share common setup or constraints between actions.
    def set_rating
      @rating = Rating.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def rating_params
      params.require(:rating).permit(:title, :items)
    end
end
