# encoding: utf-8

class ItemPictureUploader < CarrierWave::Uploader::Base
  include CarrierWaveDirect::Uploader

=begin
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end
=end
end
