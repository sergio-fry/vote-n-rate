class CreateRatings < ActiveRecord::Migration
  def change
    create_table :ratings do |t|
      t.string :title
      t.text :items

      t.timestamps null: false
    end
  end
end
