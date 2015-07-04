class StoreUploadToCloudJob < ActiveJob::Base
  queue_as :default

  def perform(upload)

    aws = CelluloidS3::Aws.new [Rails.env, "uploads"].join("/")

    user_id, rating_id, item_id = upload.owner.split("/")

    key = "#{user_id}/ratings/#{rating_id}/items/#{item_id}#{upload.extension}"
    aws.write key, upload.body
    picture_url = aws.url(key)

    rating = Rating.find rating_id

    rating.with_lock do
      item = rating.items.find { |it| it.id == item_id }
      raise ActiveRecord::RecordNotFound if item.nil?

      rating.update_item(item_id, { picture: picture_url })
    end

    upload.destroy
  rescue ActiveRecord::RecordNotFound
    upload.destroy
  end
end
