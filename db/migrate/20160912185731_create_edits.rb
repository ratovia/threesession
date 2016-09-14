class CreateEdits < ActiveRecord::Migration[5.0]
  def change
    create_table :edits do |t|
      t.string :operation
      t.string :uuid
      t.string :target
      t.string :value

      t.timestamps
    end
  end
end
