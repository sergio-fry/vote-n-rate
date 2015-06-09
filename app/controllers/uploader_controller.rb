class UploaderController < ApplicationController
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
      @upload = Upload.create({
        owner: "nobody",
        mime_type: file_upload.content_type,
        extension: File.extname(file_upload.original_filename).downcase,
        body: tempfile.read,
      })
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
