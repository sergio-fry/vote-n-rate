class CreateUploads < ActiveRecord::Migration
  def change
    create_table :uploads do |t|
      t.text :owner, null: false
      t.text :body, null: false
      t.string :mime_type, null: false
      t.string :extension, null: false

      t.timestamps null: false
    end
  end
end
