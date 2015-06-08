class AddViewsToRatings < ActiveRecord::Migration
  def change
    add_column :ratings, :views, :integer, null: false, default: 0
    add_index :ratings, :views
  end
end
