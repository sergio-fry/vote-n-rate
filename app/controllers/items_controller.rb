class ItemsController < ApplicationController
  before_action :set_rating
  before_filter :authorize!, except: [:index, :vote, :unvote]

  around_action :wrap_in_record_lock, only: [:vote, :unvote, :update, :create, :destroy]

  def index
    render json: @rating.items.sort_by(&:rating).reverse
  end

  def vote
    already_voted_items = @rating.items.find_all { |it| it.vote_identites.include?(current_user.identity) }
    raise "Нельзя голосовать более чем за 3 пункта" if already_voted_items.size >= 3

    @item = @rating.items.find { |it| it.id == params[:id] }

    if @item.present? && !@item.vote_identites.include?(current_user.identity)
      @rating.update_item(@item.id, {
        rating: @item.rating + 1,
        vote_identites: @item.vote_identites + [current_user.identity],
      })
    end

    @item = @rating.items.find { |it| it.id == params[:id] }

    render json: @item

  rescue StandardError => ex
    render json: { error: ex.to_s }, status: 403
  end

  def unvote
    @item = @rating.items.find { |it| it.id == params[:id] }

    if @item.present? && @item.vote_identites.include?(current_user.identity)
      @rating.update_item(@item.id, {
        rating: @item.rating - 1,
        vote_identites: @item.vote_identites - [current_user.identity],
      })
    end

    @item = @rating.items.find { |it| it.id == params[:id] }

    render json: @item
  end

  def update
    @item = @rating.items.find { |it| it.id == params[:id] }

    attrs = params[:item].symbolize_keys
    attrs.delete(:vote_identites)

    picture_file = attrs.delete(:picture_file)

    if picture_file.present?
      upload = upload_file(picture_file, "#{@rating.id}/#{@item.id}")

      attrs[:picture] = temp_file_url(upload.id, t: Time.now.to_i)
    end


    @rating.update_item(params[:id], attrs)

    @item = @rating.items.find { |it| it.id == params[:id] }

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

  def wrap_in_record_lock
    @rating.with_lock do
      yield
    end
  end

  # TODO: limit file size
  # upload_file(params[:file], ":rating_id/:item_id")
  def upload_file(file_upload, owner)
    image = MiniMagick::Image.open(file_upload.tempfile.path)
    image.resize "500x500>"
    image.format "jpeg"

    tempfile = Tempfile.new "item_picture"
    image.write(tempfile)

    owner = "#{current_user.id}/#{owner}"

    upload = Upload.find_by(owner: owner) || Upload.new(owner: owner)

    upload.mime_type = "image/jpeg"
    upload.extension = ".jpeg"
    upload.body = tempfile.read

    if upload.save
      StoreUploadToCloudJob.set(wait: 1.minute).perform_later upload

      upload
    end
  end
end
