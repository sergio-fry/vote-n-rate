class AddStateToRatings < ActiveRecord::Migration
  def change
    add_column :ratings, :state, :string, null: false, default: 'draft'
    add_index :ratings, :state
  end
end
