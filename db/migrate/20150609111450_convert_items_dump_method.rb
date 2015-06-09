class ConvertItemsDumpMethod < ActiveRecord::Migration
  def change
    Rating.find_each do |rating|
      next if rating.read_attribute(:items).blank?

      items = rating.read_attribute(:items).split("\n").map do |line|
        id, title, item_rating = line.strip.split("|")

        Item.new id: id, title: title, rating: item_rating
      end

      Rating.where(id: rating.id).update_all items: items.map(&:to_json).join("\n")
    end
  end
end
