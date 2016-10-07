class CreateSnaps < ActiveRecord::Migration
  def change
    create_table :snaps do |t|
      t.integer :faces
      t.integer :version
      t.integer :normals
      t.integer :vertices
      t.integer :uvs
      t.string :name
      t.string :uuid
      t.text :matrix
      t.text :faces_data
      t.text :normals_data
      t.text :vertices_data
      t.text :uvs_data
      t.json

      t.timestamps null: false
    end
  end
end
