class CreateSnaps < ActiveRecord::Migration
  def change
    create_table :snaps do |t|
      t.json :json

      t.timestamps null: false
    end
  end
end
