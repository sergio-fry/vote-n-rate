class RatingsController < ApplicationController
  before_action :set_rating, only: [:show, :edit, :update, :destroy]
  before_filter :authorize!, except: [:show, :index]
  before_filter :authorize_record!, only: [:update, :destroy]

  # GET /ratings
  # GET /ratings.json
  def index
    @ratings_popular = Rating.where(state: "published").order("views DESC, created_at DESC").limit(5)
    @ratings_recent = Rating.where(state: "published").where.not(id: @ratings_popular.pluck(:id)).order("created_at DESC").limit(5)
  end

  # GET /ratings/1
  # GET /ratings/1.json
  def show
    Rails.cache.fetch "RatingsController/#{request.ip}/#{@rating.id}/view", expires_in: 30.minutes do
      Rating.where(id: params[:id]).update_all views: @rating.views + 1
    end
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
    @rating = Rating.new(rating_params.merge(user_id: current_user.id))

    respond_to do |format|
      if @rating.save
        format.html { redirect_to @rating }
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
        format.html { redirect_to @rating }
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
      format.html { redirect_to ratings_url, notice: 'Рейтинг удален навсегда' }
      format.json { head :no_content }
    end
  end

  private

  def authorize!
    unless logged_in?
      redirect_to "http://#{Rails.configuration.x.auth_server}/sign_in?return_url=#{root_url}"
      false
    end
  end

  def authorize_record!
    if @rating.user_id != current_user.id
      flash[:error] = "У Вес нет прав редактировать этот рейтинг"
      redirect_to :back
      return
    end
  end

    # Use callbacks to share common setup or constraints between actions.
    def set_rating
      @rating = Rating.find_by(id: params[:id])

      if @rating.blank?
        redirect_to root_path
        return
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def rating_params
      params.require(:rating).permit(:title)
    end
end
