class CreateEdits < ActiveRecord::Migration[5.0]
  def change
    create_table :edits do |t|
      t.string :operation
      t.string :target
      t.integer :value

      t.timestamps
    end
  end
end
