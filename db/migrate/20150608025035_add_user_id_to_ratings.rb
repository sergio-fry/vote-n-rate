class AddUserIdToRatings < ActiveRecord::Migration
  def change
    add_column :ratings, :user_id, :integer, null: false
    add_index :ratings, :user_id
  end
end
