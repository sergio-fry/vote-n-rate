class UploaderController < ApplicationController
  before_filter :authorize!, except: :file

  # TODO: limit file size
  def upload
    file_upload = params[:file]

    image = MiniMagick::Image.open(file_upload.tempfile.path)
    image.resize "500x500>"
    image.format "jpeg"

    tempfile = Tempfile.new "item_picture"
    image.write(tempfile)

    logger.info "Writing file..."
    logger.silence do
      owner = "#{current_user.id}/#{params[:owner]}"

      @upload = Upload.find_by(owner: owner) || Upload.new(owner: owner)

      @upload.mime_type = file_upload.content_type
      @upload.extension = File.extname(file_upload.original_filename).downcase
      @upload.body = tempfile.read

      @upload.save!
    end

    render json: { picture: url_for(:action => :file, :id => @upload.id, :format => "jpeg" ) }
  rescue StandardError => ex
    render json: { error: ex.to_s }
  end

  def file
    @upload= Upload.find params[:id]

    send_data @upload.body
  end
end
