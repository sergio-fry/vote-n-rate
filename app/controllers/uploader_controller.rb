class UploaderController < ApplicationController
  before_filter :authorize!, except: :file

  # TODO: limit file size
  def upload_file
    file_upload = params[:file]

    image = MiniMagick::Image.open(file_upload.tempfile.path)
    image.resize "500x500>"
    image.format "jpeg"

    tempfile = Tempfile.new "item_picture"
    image.write(tempfile)

    owner = "#{current_user.id}/#{params[:owner]}"

    @upload = Upload.find_by(owner: owner) || Upload.new(owner: owner)

    @upload.mime_type = file_upload.content_type
    @upload.extension = File.extname(file_upload.original_filename).downcase
    @upload.body = tempfile.read

    @upload.save!

    render json: { picture: url_for(:action => :file, :id => "#{@upload.id}-#{@upload.updated_at.to_i}", :format => "jpeg" ) }
  rescue StandardError => ex
    logger.error ex.backtrace
    render json: { error: "Ошибка при загрузке изображения" }
  end

  def file
    @upload= Upload.find params[:id]

    send_data @upload.body
  end
end
