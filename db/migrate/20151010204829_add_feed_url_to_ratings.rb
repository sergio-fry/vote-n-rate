class AddFeedUrlToRatings < ActiveRecord::Migration
  def change
    add_column :ratings, :feed_url, :string
    add_column :ratings, :items_limit, :integer
  end
end
